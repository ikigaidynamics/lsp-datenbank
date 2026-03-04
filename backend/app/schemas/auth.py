from pydantic import BaseModel, ConfigDict, Field


class LoginRequest(BaseModel):
    username: str
    password: str


class ProfileUpdate(BaseModel):
    current_password: str
    new_username: str | None = None
    new_display_name: str | None = None
    new_password: str | None = Field(default=None, min_length=6)


class AuthResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: int
    username: str
    role: str
    display_name: str | None = Field(default=None, alias="displayName")
