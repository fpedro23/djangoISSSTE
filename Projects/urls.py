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
from django.views.generic.base import RedirectView
from django.contrib.auth import views as auth_views

import djangoISSSTE
from djangoISSSTE import views
from djangoISSSTE import urls
from djangoISSSTE import api
from django.http import HttpResponseRedirect
from django.conf import settings

admin.autodiscover()

urlpatterns = [
    url(r'^$', RedirectView.as_view(url='/admin')),
    url(r'^admin/', admin.site.urls),
    url(r'^o/', include('oauth2_provider.urls', namespace='oauth2_provider')),
    url(r'issste/', include(djangoISSSTE.urls)),
    url(r'^api/estados', api.EstadosEndpoint.as_view()),
    url(r'^api/municipios_por_estado', api.MunicipiosForEstadosEndpoint.as_view()),
    url(r'^api/inicio', api.ReporteInicioEndpoint.as_view()),
    #url(r'^validation/', djangoISSSTE.views.validation),
    url(r'^ios/', djangoISSSTE.views.ios_view),


    url(r'^chaining/', include('smart_selects.urls')),
    url(r'^secrets', djangoISSSTE.views.secret_page, name='secret'),
    url(r'^test', djangoISSSTE.views.test, name='test'),
    url(r'^catalogos$', djangoISSSTE.views.meta, name='meta'),
    url(r'^meta$', djangoISSSTE.views.meta, name='meta'),
    url(r'^consultas', djangoISSSTE.views.consultas, name='consultas'),
    url(r'^usuarios', djangoISSSTE.views.usuarios, name='usuarios'),
    url(r'^movimientos', djangoISSSTE.views.movimientos, name='movimientos'),
    url(r'^ayuda', djangoISSSTE.views.ayuda, name='ayuda'),
    url(r'^videos', djangoISSSTE.views.videos),
    url(r'^ver_video', djangoISSSTE.views.ver_video),
    url(r'^manuales-Pdf', djangoISSSTE.views.manuales),

    url(r'^admin/password_reset/$', auth_views.password_reset, name='admin_password_reset'),
    url(r'^admin/password_reset/done/$', auth_views.password_reset_done, name='password_reset_done'),
    url(r'^reset/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>.+)/$', auth_views.password_reset_confirm, name='password_reset_confirm'),
    url(r'^reset/done/$', auth_views.password_reset_complete, name='password_reset_complete'),

    url(r'^chaining/', include('smart_selects.urls')),

    url(r'^test', djangoISSSTE.views.test, name='test'),
    url(r'^register-by-token',views.register_by_access_token, name='register_by_access_token'),
    url(r'^djangoISSSTE/consulta_filtros', djangoISSSTE.views.consulta_web, name='consulta_filtros'),
    url(r'^djangoISSSTE/consulta_predefinidos', djangoISSSTE.views.consulta_predefinidos, name='consulta_filtros'),

    url(r'^ico_pequenio_ISSSTE.png/$', lambda x: HttpResponseRedirect(settings.STATIC_URL+'/assets/Imagenes/ico_pequenio_ISSSTE.png')), #google chrome favicon fix

]
