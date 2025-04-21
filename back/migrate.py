from database import migrate


async def migrateUp():
    await migrate()
