from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    
    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        STAFF = "STAFF", "Staff"
        CUSTOMER = "CUSTOMER", "Customer"
    
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.CUSTOMER)
    profile_image = models.ImageField(upload_to="profile_images/", blank=True, null=True)

    dietary_preferences = models.TextField(blank=True, default="")
    allergies = models.ManyToManyField(
        "app.Ingredient",
        blank=True,
        related_name="allergic_users",
        limit_choices_to={"is_allergen": True},
    )

    def save(self, *args, **kwargs):
        if self.is_superuser:
            self.role = self.Role.ADMIN
        super().save(*args, **kwargs)
    