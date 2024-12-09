from ninja import Router
from pydantic import ValidationError
from django.contrib.auth.hashers import make_password, check_password

from .models import User
from .schemas import RegisterSchema, UserDetailSchema
from core.schemas import MessageSchema

router = Router()

@router.post("/register", response= {201: UserDetailSchema, 400: MessageSchema})
def register(request, payload: RegisterSchema):
    try:
        if User.objects.filter(email=payload.email).exists():
            return 400, {"message": "Email is already registered."}
        
        if User.objects.filter(username=payload.username).exists():
            return 400, {"message": "Username is already registered."}

        user_data = payload.dict()

        user_data['password'] = make_password(user_data['password'])

        user = User.objects.create(**user_data)

        return 201, user
    except ValidationError as e:
        return 400, {"message": str(e)}
    except Exception as e:
        return 400, {"message": "An unexpected error occurred."}