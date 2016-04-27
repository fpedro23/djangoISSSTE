"""Projects URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin

import djangoISSSTE
from djangoISSSTE import api
from  djangoISSSTE import views

admin.autodiscover()

urlpatterns = [
    #url(r'^$', 'djangoISSSTE.views.redirect_admin', name='redirect_admin'),
    url(r'^o/', include('oauth2_provider.urls', namespace='oauth2_provider')),
    url(r'^admin/', admin.site.urls),
    url(r'^api/estados', api.EstadosEndpoint.as_view()),
    url(r'^api/municipios_por_estado', api.MunicipiosForEstadosEndpoint.as_view()),
    url(r'^api/inicio', api.ReporteInicioEndpoint.as_view()),


    url(r'^secrets', djangoISSSTE.views.secret_page, name='secret'),
    url(r'^test', djangoISSSTE.views.test, name='test'),
    url(r'^register-by-token',views.register_by_access_token, name='register_by_access_token'),
     url(r'^catalogos$', 'djangoISSSTE.views.catalogos', name='catalogos'),
    url(r'^consultas', 'djangoISSSTE.views.consultas', name='consultas'),
    url(r'^usuarios', 'djangoISSSTE.views.usuarios', name='usuarios'),
    url(r'^movimientos', 'djangoISSSTE.views.movimientos', name='movimientos')
]
