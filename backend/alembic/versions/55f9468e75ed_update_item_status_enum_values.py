"""Update item status enum values

Revision ID: 55f9468e75ed
Revises: 171233f15090
Create Date: 2025-11-23 22:23:03.030028

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '55f9468e75ed'
down_revision = '171233f15090'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Изменение enum типа для status
    # PostgreSQL требует пересоздания enum типа
    op.execute("ALTER TYPE itemstatus RENAME TO itemstatus_old;")
    op.execute("CREATE TYPE itemstatus AS ENUM ('available', 'reserved', 'purchased');")
    op.execute("ALTER TABLE wishlist_items ALTER COLUMN status TYPE itemstatus USING status::text::itemstatus;")
    op.execute("DROP TYPE itemstatus_old;")


def downgrade() -> None:
    # Откат изменений enum типа
    op.execute("ALTER TYPE itemstatus RENAME TO itemstatus_old;")
    op.execute("CREATE TYPE itemstatus AS ENUM ('active', 'purchased', 'irrelevant');")
    op.execute("ALTER TABLE wishlist_items ALTER COLUMN status TYPE itemstatus USING 'active'::itemstatus;")
    op.execute("DROP TYPE itemstatus_old;")
