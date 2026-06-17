from pydantic import BaseModel
from typing import Optional

# ------------------
# USER
# ------------------

class RegisterUser(BaseModel):
    name: str
    email: str
    password: str


class LoginUser(BaseModel):
    email: str
    password: str


# ------------------
# CATEGORY
# ------------------

class CategoryCreate(BaseModel):
    name: str


# ------------------
# EXPENSE
# ------------------

class ExpenseCreate(BaseModel):
    title: str
    amount: float
    category_id: str


class ExpenseUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[float] = None
    category_id: Optional[str] = None


# ------------------
# BUDGET
# ------------------

class BudgetCreate(BaseModel):
    month: str
    amount: float


class BudgetUpdate(BaseModel):
    month: Optional[str] = None
    amount: Optional[float] = None