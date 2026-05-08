from dotenv import load_dotenv
from pathlib import Path
from contextlib import asynccontextmanager

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import io
import os
import logging
import uuid
from datetime import datetime, timezone, timedelta
from typing import List, Optional

import bcrypt
import jwt
from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from fastapi.responses import StreamingResponse
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field
import openpyxl


# ---------- Database ----------
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]


# ---------- Constants ----------
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7

DEFAULT_PRODUCTS = [
    {"name": "Nativo", "abbr": "NAT"},
    {"name": "Verango", "abbr": "VER"},
    {"name": "Oberon", "abbr": "OBE"},
    {"name": "Fox Xpro", "abbr": "FXX"},
    {"name": "Connect", "abbr": "CON"},
    {"name": "Belt", "abbr": "BEL"},
    {"name": "Decis", "abbr": "DEC"},
    {"name": "Movento", "abbr": "MOV"},
    {"name": "Fox", "abbr": "FOX"},
]


# ---------- Helpers ----------
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        "type": "access",
    }
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


def auto_abbreviate(name: str) -> str:
    name = (name or "").strip()
    if not name:
        return ""
    for p in DEFAULT_PRODUCTS:
        if p["name"].lower() == name.lower():
            return p["abbr"]
    cleaned = "".join(c for c in name if c.isalpha())
    return cleaned[:3].upper() if cleaned else name[:3].upper()


def greeting_for_now() -> str:
    now = datetime.now(timezone.utc) - timedelta(hours=3)
    if 5 <= now.hour < 12:
        return "Bom dia"
    if 12 <= now.hour < 18:
        return "Boa tarde"
    return "Boa noite"


# ---------- Models ----------
class UserPublic(BaseModel):
    id: str
    email: str
    name: str
    role: str = "user"


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=4)
    name: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPublic


class ProductionItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    date: str
    unit: str
    sc: str
    product: str
    product_abbr: str = ""
    batch: str
    quantity: Optional[float] = None
    quantity_unit: str = "kg"
    material_status: str = "Disponível"
    situation: str = "A preparar"
    observation: str = ""
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class ProductionItemCreate(BaseModel):
    date: str
    unit: str
    sc: str
    product: str
    batch: str
    quantity: Optional[float] = None
    quantity_unit: str = "kg"
    material_status: str = "Disponível"
    situation: str = "A preparar"
    observation: str = ""


class ProductionItemUpdate(BaseModel):
    unit: Optional[str] = None
    sc: Optional[str] = None
    product: Optional[str] = None
    batch: Optional[str] = None
    quantity: Optional[float] = None
    quantity_unit: Optional[str] = None
    material_status: Optional[str] = None
    situation: Optional[str] = None
    observation: Optional[str] = None
    date: Optional[str] = None


# ---------- Lifespan (SUBSTITUI startup/shutdown) ----------
@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.users.create_index("email", unique=True)
    await db.production_items.create_index("id", unique=True)
    await db.products.create_index("id", unique=True)
    print("🚀 Server started")

    yield

    client.close()
    print("🛑 Server stopped")


# ---------- App ----------
app = FastAPI(title="Bayer Production Control", lifespan=lifespan)
api_router = APIRouter(prefix="/api")


# ---------- Auth ----------
async def get_current_user(request: Request):
    auth = request.headers.get("Authorization", "")
    token = auth.replace("Bearer ", "")

    if not token:
        raise HTTPException(401, "Não autenticado")

    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Token expirado")
    except jwt.InvalidTokenError:
        raise HTTPException(401, "Token inválido")

    user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(401, "Usuário não encontrado")

    return user


# ---------- Routes ----------
@api_router.post("/auth/register", response_model=TokenResponse)
async def register(payload: RegisterRequest):
    email = payload.email.lower()

    if await db.users.find_one({"email": email}):
        raise HTTPException(400, "E-mail já cadastrado")

    user_id = str(uuid.uuid4())

    await db.users.insert_one({
        "id": user_id,
        "email": email,
        "password_hash": hash_password(payload.password),
        "name": payload.name,
        "role": "user",
        "created_at": datetime.now(timezone.utc).isoformat(),
    })

    token = create_access_token(user_id, email)

    return TokenResponse(
        access_token=token,
        user=UserPublic(id=user_id, email=email, name=payload.name)
    )


@api_router.post("/auth/login", response_model=TokenResponse)
async def login(payload: LoginRequest):
    email = payload.email.lower()
    user = await db.users.find_one({"email": email})

    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(401, "Credenciais inválidas")

    token = create_access_token(user["id"], email)

    return TokenResponse(
        access_token=token,
        user=UserPublic(id=user["id"], email=email, name=user["name"])
    )


# ---------- Excel ----------
@api_router.get("/export/excel")
async def export_excel(date: str, user: dict = Depends(get_current_user)):
    items = await db.production_items.find({"date": date}).to_list(2000)

    wb = openpyxl.Workbook()
    ws = wb.active

    ws.append(["Produto", "Lote"])

    for it in items:
        ws.append([it.get("product"), it.get("batch")])

    buf = io.BytesIO()
    wb.save(buf)
    buf.seek(0)

    return StreamingResponse(
        buf,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": 'attachment; filename="relatorio.xlsx"'},
    )


# ---------- New Models ----------
class ProductCreate(BaseModel):
    name: str
    abbr: str
    category: str = "Fungicida"
    description: str = ""
    bag_weight: str = "Consultar NF"

class UserRoleUpdate(BaseModel):
    role: str

# ---------- Admin helper ----------
async def require_admin(user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(403, "Acesso restrito a administradores")
    return user

# ---------- Production CRUD ----------
@api_router.get("/production")
async def list_production(date: str = None, user: dict = Depends(get_current_user)):
    query = {"date": date} if date else {}
    items = await db.production_items.find(query, {"_id": 0}).sort("created_at", -1).to_list(500)
    return items

@api_router.post("/production")
async def create_production(payload: ProductionItemCreate, user: dict = Depends(get_current_user)):
    item_id = str(uuid.uuid4())
    item = {"id": item_id, "date": payload.date, "unit": payload.unit, "sc": payload.sc, "product": payload.product, "product_abbr": auto_abbreviate(payload.product), "batch": payload.batch, "quantity": payload.quantity, "quantity_unit": payload.quantity_unit, "material_status": payload.material_status, "situation": payload.situation, "observation": payload.observation, "created_by": user["id"], "created_at": datetime.now(timezone.utc).isoformat(), "updated_at": datetime.now(timezone.utc).isoformat()}
    await db.production_items.insert_one(item)
    item.pop("_id", None)
    return item

@api_router.patch("/production/{item_id}")
async def update_production(item_id: str, payload: ProductionItemUpdate, user: dict = Depends(get_current_user)):
    existing = await db.production_items.find_one({"id": item_id})
    if not existing:
        raise HTTPException(404, "Item nao encontrado")
    if existing.get("created_by") != user["id"] and user.get("role") != "admin":
        raise HTTPException(403, "Sem permissao")
    updates = {k: v for k, v in payload.dict(exclude_unset=True).items() if v is not None}
    updates["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.production_items.update_one({"id": item_id}, {"$set": updates})
    updated = await db.production_items.find_one({"id": item_id}, {"_id": 0})
    return updated

@api_router.delete("/production/{item_id}")
async def delete_production(item_id: str, user: dict = Depends(get_current_user)):
    existing = await db.production_items.find_one({"id": item_id})
    if not existing:
        raise HTTPException(404, "Item nao encontrado")
    if existing.get("created_by") != user["id"] and user.get("role") != "admin":
        raise HTTPException(403, "Sem permissao")
    await db.production_items.delete_one({"id": item_id})
    return {"ok": True}

# ---------- Products ----------
@api_router.get("/products")
async def list_products(user: dict = Depends(get_current_user)):
    products = await db.products.find({}, {"_id": 0}).to_list(200)
    if not products:
        return DEFAULT_PRODUCTS
    return products

@api_router.post("/products")
async def create_product(payload: ProductCreate, user: dict = Depends(require_admin)):
    prod = {"id": str(uuid.uuid4()), "name": payload.name, "abbr": payload.abbr, "category": payload.category, "description": payload.description, "bag_weight": payload.bag_weight}
    await db.products.insert_one(prod)
    prod.pop("_id", None)
    return prod

@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str, user: dict = Depends(require_admin)):
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(404, "Produto nao encontrado")
    return {"ok": True}

# ---------- Admin Routes ----------
@api_router.get("/admin/users")
async def admin_list_users(user: dict = Depends(require_admin)):
    users = await db.users.find({}, {"_id": 0, "password_hash": 0}).to_list(500)
    return users

@api_router.patch("/admin/users/{user_id}/role")
async def admin_update_role(user_id: str, payload: UserRoleUpdate, user: dict = Depends(require_admin)):
    result = await db.users.update_one({"id": user_id}, {"$set": {"role": payload.role}})
    if result.matched_count == 0:
        raise HTTPException(404, "Usuario nao encontrado")
    updated = await db.users.find_one({"id": user_id}, {"_id": 0, "password_hash": 0})
    return updated

@api_router.delete("/admin/users/{user_id}")
async def admin_delete_user(user_id: str, user: dict = Depends(require_admin)):
    if user_id == user["id"]:
        raise HTTPException(400, "Nao pode deletar sua propria conta")
    result = await db.users.delete_one({"id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(404, "Usuario nao encontrado")
    return {"ok": True}

@api_router.get("/admin/stats")
async def admin_stats(user: dict = Depends(require_admin)):
    total_users = await db.users.count_documents({})
    total_items = await db.production_items.count_documents({})
    total_products = await db.products.count_documents({})
    return {"total_users": total_users, "total_items": total_items, "total_products": total_products}

# ---------- Final ----------
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
