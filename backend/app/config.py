from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///data/lsp.db"
    SECRET_KEY: str = "change-me-in-production"
    SESSION_MAX_AGE: int = 3600 * 8  # 8 hours

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
