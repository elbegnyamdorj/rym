from datetime import datetime
from django.db import models
from django.db.models.base import Model
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db.models.deletion import CASCADE
from django.db.models.fields.related import ForeignKey
from django.utils.translation import ugettext_lazy as _

# Create your models here.


class UserType(models.Model):
    """DONE"""

    user_type_name = models.CharField(max_length=50)
    description = models.CharField(max_length=100)


class UserManager(BaseUserManager):
    """DONE"""

    """Define a model manager for User model with no username field."""
    use_in_migrations = True

    def _create_user(self, email, password, user_type_id, **extra_fields):
        """Create and save a User with the given email and password."""
        if not email:
            raise ValueError("The given email must be set")
        email = self.normalize_email(email)
        user = self.model(
            email=email,
            user_type_id=UserType.objects.get(id=user_type_id),
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        # user = Users.objects.update_or_create(user)
        return user

    def create_preuser(self, email, password, user_type_id, **extra_fields):
        """
        Багш group-д нэмэхэд Users дотор үүссэн хаяг дараа нь
        оюутан өөрөө бүртгүүлэх үед ашиглагдах method
        """
        Users.objects.filter(email=email).update(
            user_type_id=UserType.objects.get(id=user_type_id), **extra_fields
        )
        user = Users.objects.get(email=email)
        user.set_password(password)
        user.save()

        return user

    def create_superuser(self, email, password, **extra_fields):
        """Create and save a SuperUser with the given email and password."""
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("user_type_id", 1)
        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self._create_user(email, password, **extra_fields)


class Users(AbstractUser):
    """DONE"""

    """User model."""
    username = None
    email = models.EmailField(_("email address"), unique=True)
    user_type_id = models.ForeignKey(UserType, on_delete=models.CASCADE)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
    objects = UserManager()


class RatingCriteria(models.Model):
    rc_name = models.CharField(max_length=1000)
    description = models.CharField(max_length=1000, default="")
    teacher_id = models.ForeignKey(Users, on_delete=CASCADE)
    is_default = models.BooleanField()
    from_default = models.BooleanField()


class DefaultRatingCriteria(models.Model):
    rc_name = models.CharField(max_length=1000)
    description = models.CharField(max_length=1000, default="")


class Group(models.Model):
    """DONE"""

    teacher_id = models.ForeignKey(Users, on_delete=models.CASCADE)
    group_number = models.CharField(max_length=4)
    lesson_name = models.CharField(max_length=30)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)


class GroupStudents(models.Model):
    """DONE"""

    group_id = models.ForeignKey(Group, on_delete=CASCADE)
    student_id = models.ForeignKey(Users, on_delete=CASCADE)


class SubGroup(models.Model):
    """DONE"""

    subgroup_name = models.CharField(max_length=100)
    group_id = models.ForeignKey(Group, on_delete=CASCADE)
    is_active = models.BooleanField(default=True)
    deadline = models.DateTimeField(auto_now_add=True)


# class Team(models.Model):
#     team_name = models.CharField(max_length=180)
#     subgroup_id = models.ForeignKey(SubGroup, on_delete=CASCADE)


class TeamMember(models.Model):
    """DONE"""

    team_name = models.CharField(max_length=180)
    subgroup_id = models.ForeignKey(SubGroup, on_delete=CASCADE)
    group_student_id = models.ForeignKey(GroupStudents, on_delete=CASCADE)


"""
[
    oyutniiner:sda,
    email:sda@gmail.com,
    dun:[1,2,3,4,5,6,]
]
"""


class Comments(models.Model):
    good_comm = models.CharField(max_length=1000)
    bad_comm = models.CharField(max_length=1000)


class Ratings(models.Model):
    """DONE"""

    team_member_id = models.ForeignKey(TeamMember, on_delete=CASCADE)
    rc_name = models.CharField(max_length=1000)
    rc_id = models.ForeignKey(RatingCriteria, on_delete=CASCADE, default=None)
    rating_value = models.IntegerField()
    comment_id = models.ForeignKey(Comments, on_delete=CASCADE, default=None)
    rated_by_id = models.ForeignKey(Users, on_delete=CASCADE, default=None, null=True)
    rated_at = models.DateField(auto_now_add=True)
