from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class UserCreate(BaseModel):
    username: str = Field(min_length=1, max_length=100)
    password: str = Field(min_length=6)
    role: Literal["readonly", "readwrite", "admin"]
    display_name: str | None = Field(default=None, max_length=255)


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: int
    username: str
    role: str
    display_name: str | None = Field(default=None, alias="displayName")
    created_at: datetime = Field(alias="createdAt")


class UserRoleUpdate(BaseModel):
    role: Literal["readonly", "readwrite", "admin"]
