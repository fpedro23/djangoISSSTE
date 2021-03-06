__author__ = 'ariaocho'

from django import template
from django import forms
from django.contrib.humanize.templatetags.humanize import intcomma
register = template.Library()

@register.filter(name='add_attributes')
def add_attributes(field, css):
    attrs = {}
    definition = css.split(',')

    for d in definition:
        if ':' not in d:
            attrs['class'] = d
        else:
            t, v = d.split(':')
            attrs[t] = v
    return field.as_widget(attrs=attrs)


@register.filter(name='add_desc')
def add_desc(field, css):
    attrs = {}
    definition = css.split(',')

    for d in definition:
        if '=' not in d:
            attrs['data-filename-placement'] = d
        else:
            t, v = d.split('=')
            attrs[t] = v
    return field.as_widget(attrs=attrs)


@register.filter(name='is_file')
def is_file(field):
    return isinstance(field.field.widget, forms.ClearableFileInput)

@register.filter(name='addcss')
def addcss(field, css):
    return field.as_widget(attrs={"class":css})

@register.filter(name='formatoNumero')
def currency(field):
    if field=='-' or field == "None": field=0
    moneda = round(float(field), 2)
    return "$%s%s" % (intcomma(int(moneda)), ("%0.2f" % moneda)[-3:])
