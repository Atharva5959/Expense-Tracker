from fastapi import FastAPI
from fastapi import HTTPException
from fastapi import Depends
from fastapi.middleware.cors import CORSMiddleware
from database import supabase
import token

from security import (
    hash_password,
    verify_password
)

from auth import (
    create_token,
    get_current_user
)

from schemas import *

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Personal Finance Tracker API Running"}


@app.post("/register")
def register(user: RegisterUser):

    existing = supabase.table(
        "users"
    ).select("*").eq(
        "email",
        user.email
    ).execute()

    if existing.data:
        raise HTTPException(
            status_code=400,
            detail="User already exists"
        )

    hashed_password = hash_password(
        user.password
    )

    supabase.table(
        "users"
    ).insert({
        "name": user.name,
        "email": user.email,
        "password": hashed_password
    }).execute()

    return {
        "message":"User Registered"
    }


@app.post("/login")
def login(user: LoginUser):

    result = supabase.table(
        "users"
    ).select("*").eq(
        "email",
        user.email
    ).execute()

    if not result.data:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    db_user = result.data[0]

    if not verify_password(
        user.password,
        db_user["password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Wrong Password"
        )


    token = create_token({
        "user_id": db_user["id"]
    })

    return {
        "message": "Login Successful",
        "token": token,
        "name": db_user["name"]
    }


@app.post("/categories")
def create_category(
    category: CategoryCreate,
    user_id=Depends(get_current_user)
):

    result = supabase.table(
        "categories"
    ).insert({
        "name": category.name,
        "user_id": user_id
    }).execute()

    return result.data


@app.get("/categories")
def get_categories(
    user_id=Depends(get_current_user)
):

    result = supabase.table(
        "categories"
    ).select("*").eq(
        "user_id",
        user_id
    ).execute()

    return result.data


@app.post("/expenses")
def create_expense(
    expense: ExpenseCreate,
    user_id=Depends(get_current_user)
):

    result = supabase.table(
        "expenses"
    ).insert({
        "title": expense.title,
        "amount": expense.amount,
        "category_id": expense.category_id,
        "expense_date": expense.expense_date,
        "user_id": user_id
    }).execute()

    return result.data


@app.get("/expenses")
def get_expenses(
    user_id=Depends(get_current_user)
):

    result = supabase.table(
        "expenses"
    ).select("*").eq(
        "user_id",
        user_id
    ).execute()

    return result.data


@app.put("/expenses/{expense_id}")
def update_expense(
    expense_id: str,
    expense: ExpenseUpdate,
    user_id=Depends(get_current_user)
):

    result = supabase.table(
        "expenses"
    ).update(
        expense.dict(
            exclude_unset=True
        )
    ).eq(
        "id",
        expense_id
    ).execute()

    return result.data


@app.delete("/expenses/{expense_id}")
def delete_expense(
    expense_id: str,
    user_id=Depends(get_current_user)
):

    result = supabase.table(
        "expenses"
    ).delete().eq(
        "id",
        expense_id
    ).execute()

    return {
        "message": "Expense Deleted"
    }


@app.post("/budgets")
def create_budget(
    budget: BudgetCreate,
    user_id=Depends(get_current_user)
):

    result = supabase.table(
        "budgets"
    ).insert({
        "month": budget.month,
        "amount": budget.amount,
        "user_id": user_id
    }).execute()

    return result.data


@app.get("/budgets")
def get_budgets(
    user_id=Depends(get_current_user)
):

    result = supabase.table(
        "budgets"
    ).select("*").eq(
        "user_id",
        user_id
    ).execute()

    return result.data

@app.put("/budgets/{budget_id}")
def update_budget(
    budget_id: str,
    budget: BudgetUpdate,
    user_id=Depends(get_current_user)
):

    result = supabase.table(
        "budgets"
    ).update(
        budget.dict(exclude_unset=True)
    ).eq(
        "id",
        budget_id
    ).eq(
        "user_id",
        user_id
    ).execute()

    return {
        "message": "Budget Updated",
        "data": result.data
    }

@app.delete("/budgets/{budget_id}")
def delete_budget(
    budget_id: str,
    user_id=Depends(get_current_user)
):

    supabase.table(
        "budgets"
    ).delete().eq(
        "id",
        budget_id
    ).eq(
        "user_id",
        user_id
    ).execute()

    return {
        "message": "Budget Deleted"
    }


@app.get("/reports/total")
def total_expense(
    user_id=Depends(get_current_user)
):

    expenses = supabase.table(
        "expenses"
    ).select("*").eq(
        "user_id",
        user_id
    ).execute()

    total = sum(
        expense["amount"]
        for expense in expenses.data
    )

    return {
        "total_expense": total
    }

@app.get("/dashboard")
def dashboard_stats(
    user_id=Depends(get_current_user)
):

    expenses = supabase.table(
        "expenses"
    ).select("*").eq(
        "user_id",
        user_id
    ).execute()

    budgets = supabase.table(
        "budgets"
    ).select("*").eq(
        "user_id",
        user_id
    ).execute()

    categories = supabase.table(
        "categories"
    ).select("*").eq(
        "user_id",
        user_id
    ).execute()

    total_expense = sum(
        expense["amount"]
        for expense in expenses.data
    )

    total_budget = sum(
        budget["amount"]
        for budget in budgets.data
    )

    return {

        "total_expense":
        total_expense,

        "total_budget":
        total_budget,

        "remaining_budget":
        total_budget -
        total_expense,

        "total_categories":
        len(categories.data),

        "total_expense_entries":
        len(expenses.data)
    }