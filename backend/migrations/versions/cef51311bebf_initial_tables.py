"""initial tables

Revision ID: cef51311bebf
Revises: 
Create Date: 2026-06-25 21:57:36.440784
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = 'cef51311bebf'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create all tables from scratch."""

    # ======================
    # USERS
    # ======================
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True),
                  primary_key=True,
                  server_default=sa.text("gen_random_uuid()")),
        sa.Column('first_name', sa.String(50), nullable=False),
        sa.Column('last_name', sa.String(50), nullable=False),
        sa.Column('email', sa.String(100), nullable=False, unique=True),
        sa.Column('password_hash', sa.Text(), nullable=False),
        sa.Column('role', sa.String(50), nullable=False, server_default='user'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('preferences', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
    )

    # ======================
    # UNIVERSITIES
    # ======================
    op.create_table(
        'universities',
        sa.Column('id', postgresql.UUID(as_uuid=True),
                  primary_key=True,
                  server_default=sa.text("gen_random_uuid()")),
        sa.Column('slug', sa.String(100), nullable=False, unique=True),
        sa.Column('name', sa.String(300), nullable=False),
        sa.Column('country', sa.String(100), nullable=False),
        sa.Column('subregion', sa.String(100)),
        sa.Column('state', sa.String(100)),
        sa.Column('city', sa.String(100)),
        sa.Column('size', sa.String(20)),
        sa.Column('focus', sa.String(30)),
        sa.Column('research_level', sa.String(30)),
        sa.Column('is_public', sa.Boolean, default=True),
        sa.Column('established_year', sa.Integer),
        sa.Column('total_students', sa.Integer),
        sa.Column('total_faculty', sa.Integer),
        sa.Column('avg_fees', sa.Numeric(12, 2)),
        sa.Column('placement_percentage', sa.Numeric(5, 2)),
        sa.Column('description', sa.Text),
        sa.Column('website_url', sa.String(300)),
        sa.Column('campus_photo', sa.String(300)),
        sa.Column('has_medicine', sa.Boolean),
        sa.Column('has_scholarship', sa.Boolean),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # ======================
    # RANKING SCORES
    # ======================
    op.create_table(
        'ranking_scores',
        sa.Column('id', postgresql.UUID(as_uuid=True),
                  primary_key=True,
                  server_default=sa.text("gen_random_uuid()")),
        sa.Column('university_id', postgresql.UUID(as_uuid=True),
                  sa.ForeignKey('universities.id', ondelete='CASCADE'),
                  nullable=False),
        sa.Column('year', sa.Integer, nullable=False),
        sa.Column('rank', sa.Integer),
        sa.Column('overall_score', sa.Float),

        sa.Column('ar_score', sa.Float),
        sa.Column('er_score', sa.Float),
        sa.Column('fsr_score', sa.Float),
        sa.Column('irn_score', sa.Float),
        sa.Column('cpp_score', sa.Float),
        sa.Column('ppf_score', sa.Float),
        sa.Column('swp_score', sa.Float),
        sa.Column('ifr_score', sa.Float),
        sa.Column('isr_score', sa.Float),
        sa.Column('inbound_score', sa.Float),
        sa.Column('outbound_score', sa.Float),

        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint('university_id', 'year', name='uq_university_year')
    )

    # ======================
    # UNIVERSITY METRICS
    # ======================
    op.create_table(
        'university_metrics',
        sa.Column('id', postgresql.UUID(as_uuid=True),
                  primary_key=True,
                  server_default=sa.text("gen_random_uuid()")),
        sa.Column('university_id', postgresql.UUID(as_uuid=True),
                  sa.ForeignKey('universities.id', ondelete='CASCADE'),
                  unique=True,
                  nullable=False),
        sa.Column('research_score', sa.Numeric(5, 2)),
        sa.Column('placement_score', sa.Numeric(5, 2)),
        sa.Column('faculty_score', sa.Numeric(5, 2)),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # ======================
    # COURSES
    # ======================
    op.create_table(
        'courses',
        sa.Column('id', postgresql.UUID(as_uuid=True),
                  primary_key=True,
                  server_default=sa.text("gen_random_uuid()")),
        sa.Column('university_id', postgresql.UUID(as_uuid=True),
                  sa.ForeignKey('universities.id', ondelete='CASCADE'),
                  nullable=False),
        sa.Column('name', sa.String(300), nullable=False),
        sa.Column('degree_type', sa.String(50), nullable=False),
        sa.Column('duration', sa.Integer),
        sa.Column('total_seats', sa.Integer),
        sa.Column('fees', sa.Numeric(12, 2)),
        sa.Column('eligibility', sa.Text),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    # ======================
    # ADMISSION DETAILS
    # ======================
    op.create_table(
        'admission_details',
        sa.Column('id', postgresql.UUID(as_uuid=True),
                  primary_key=True,
                  server_default=sa.text("gen_random_uuid()")),
        sa.Column('university_id', postgresql.UUID(as_uuid=True),
                  sa.ForeignKey('universities.id', ondelete='CASCADE'),
                  nullable=False),
        sa.Column('admission_process', sa.Text),
        sa.Column('entrance_exams', sa.String(200)),
        sa.Column('application_deadline', sa.Date),
        sa.Column('minimum_gpa', sa.Numeric(3, 2)),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # ======================
    # SAVED UNIVERSITIES
    # ======================
    op.create_table(
        'saved_universities',
        sa.Column('id', postgresql.UUID(as_uuid=True),
                  primary_key=True,
                  server_default=sa.text("gen_random_uuid()")),
        sa.Column('user_id', postgresql.UUID(as_uuid=True),
                  sa.ForeignKey('users.id', ondelete='CASCADE'),
                  nullable=False),
        sa.Column('university_id', postgresql.UUID(as_uuid=True),
                  sa.ForeignKey('universities.id', ondelete='CASCADE'),
                  nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint('user_id', 'university_id', name='uq_user_university')
    )


def downgrade() -> None:
    """Drop all tables in reverse order."""

    op.drop_table('saved_universities')
    op.drop_table('admission_details')
    op.drop_table('courses')
    op.drop_table('university_metrics')
    op.drop_table('ranking_scores')
    op.drop_table('universities')
    op.drop_table('users')