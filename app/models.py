from django.db import models

# Parent = models.ForeignKey(
#   "self",
#   on_delete=models.CASCADE,
#   null=True,
#   blank=True,
#   related_name="subcategories"
# ) ako zelim dodati podkategorije


class Category(models.Model):
    Name = models.CharField(max_length=20, unique=True)
    Description = models.CharField(max_length=120, blank=True)

class Ingredient(models.Model):
    Name = models.CharField(max_length=20, unique=True)
    is_allergen = models.BooleanField()
    is_vegetarian = models.BooleanField()
    is_vegan = models.BooleanField()

class MeniItem(models.Model):
    Name = models.CharField(max_length=20)
    Description = models.CharField(max_length=120)
    Price = models.DecimalField(max_digits=6, decimal_places=2)
    Image = models.ImageField(upload_to="menu/")
    Available = models.BooleanField(default=True)

    Category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="menu_items"
    )

    Ingredient = models.ManyToManyField(
        Ingredient,
        related_name="menu_items"
    )


