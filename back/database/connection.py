import os
from supabase import create_client

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")


def connect():
    return create_client(url, key)
