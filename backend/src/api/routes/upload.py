import os
import uuid
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from src.api.dependencies import require_admin

router = APIRouter(prefix="/api", tags=["Upload"])

_UPLOAD_DIR = os.path.join("static", "images")
_ALLOWED   = {"image/jpeg", "image/png", "image/webp", "image/gif"}
_MAX_BYTES  = 15 * 1024 * 1024   # 15 MB


@router.post("/upload/image", dependencies=[Depends(require_admin)])
async def upload_image(file: UploadFile = File(...)):
    if file.content_type not in _ALLOWED:
        raise HTTPException(400, "Only JPEG, PNG, WebP or GIF images are accepted.")

    data = await file.read()
    if len(data) > _MAX_BYTES:
        raise HTTPException(400, "File exceeds the 15 MB limit.")

    os.makedirs(_UPLOAD_DIR, exist_ok=True)

    raw_ext = (file.filename or "").rsplit(".", 1)
    ext     = raw_ext[-1].lower() if len(raw_ext) == 2 else "jpg"
    if ext not in {"jpg", "jpeg", "png", "webp", "gif"}:
        ext = "jpg"

    filename = f"{uuid.uuid4().hex}.{ext}"
    with open(os.path.join(_UPLOAD_DIR, filename), "wb") as fh:
        fh.write(data)

    return {"url": f"/static/images/{filename}"}
