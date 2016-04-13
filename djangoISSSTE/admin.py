from django.contrib import admin
from djangoISSSTE.models import *
# Register your models here.


class MetaInline(admin.TabularInline):
    model = Meta


class AccionEstrategicaModelAdmin(admin.ModelAdmin):
    model = AccionEstrategica
    inlines = [MetaInline]


admin.site.register(UserProfile)
admin.site.register(Delegacion)
admin.site.register(Estado)
admin.site.register(Municipio)
admin.site.register(Carencia)
admin.site.register(SubCarencia)
admin.site.register(AccionEstrategica, AccionEstrategicaModelAdmin)
admin.site.register(Meta)
