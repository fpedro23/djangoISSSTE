__author__ = 'ariaocho'

from django import template
from django import forms
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