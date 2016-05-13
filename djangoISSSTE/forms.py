# coding=utf-8
from django.forms.models import BaseInlineFormSet, ModelForm
from django import forms
from djangoISSSTE.models import *
from django.db.models.query_utils import Q


class MetaMensualForm(forms.ModelForm):
    class Meta:
        model = MetaMensual
        # can_delete = False
        fields = "__all__"

    # extra = 0

    # Define los estados visibles dependiendo del rol del usuario
    # y del estado al que pertenece en la pantalla para añadir una nueva
    # meta mensual
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "estado":
            if request.user.usuario.rol == 'AG' or request.user.usuario.rol == 'UR' or request.user.usuario.rol == 'FR':
                kwargs["queryset"] = Estado.objects.all()
            elif request.user.usuario.rol == 'UE' or request.user.usuario.rol == 'FE':
                query_estado = request.user.usuario.estado.id
                kwargs["queryset"] = Estado.objects.filter(
                    Q(id=query_estado)
                )

    def save(self, commit=True):
        instance = super(MetaMensualForm, self).save(commit=False)
        print instance.estado

        return super(MetaMensualForm, self).save(commit)