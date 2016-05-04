from django.shortcuts import render, redirect, render_to_response
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.template import RequestContext, loader
from oauth2_provider.models import AccessToken
from djangoISSSTE.tools import *
from djangoISSSTE.models import *


def get_user_for_token(token):
    if token:
        return AccessToken.objects.get(token=token).user
    else:
        return None

def register_by_access_token(request):

    #del request.session['access_token']

    if request.session.get('access_token'):
        token = {
        'access_token': request.session.get('access_token'),
        'token_type': 'Bearer'
    }
        return JsonResponse(token)
    else:
        #user = get_user_for_token('3DVteYz9OIH6gvQDyYX78GOpHKXgPy'
        user = request.user
        return get_access_token(user,request)

# Create your views here.
from django.template import RequestContext


def redirect_admin(request):
    return redirect('admin/')


@login_required()
def secret_page(request, *args, **kwargs):
    return HttpResponse('Secret contents!', status=200)


@login_required()
def test(request):
    print request.user.usuario.estado

    return HttpResponse('Secret contents!', status=200)


@login_required()
def consultas(request):
    return render_to_response('admin/djangoISSSTE/consultas.html', locals(),
                              context_instance=RequestContext(request))
@login_required()
def movimientos(request):
    return render_to_response('admin/djangoISSSTE/movimientos.html', locals(),
                                 context_instance=RequestContext(request))
@login_required()
def usuarios(request):
    return render_to_response('admin/djangoISSSTE/usuarios.html', locals(),
                                 context_instance=RequestContext(request))
@login_required()
def catalogos(request):
    return render_to_response('admin/djangoISSSTE/catalogos.html', locals(),
                              context_instance=RequestContext(request))
@login_required()
def consulta_predefinidos(request):
    return render_to_response('admin/djangoISSSTE/consulta_predefinidos/consulta-predefinidos.html', locals(),
                              context_instance=RequestContext(request))

@login_required()
def meta(request):
    return render_to_response('admin/djangoISSSTE/meta.html', locals(),
                              context_instance=RequestContext(request))
    return HttpResponse('Secret contents!', status=200)




@login_required()
def consultas(request):
    return render_to_response('admin/djangoISSSTE/consultas.html', locals(),
                              context_instance=RequestContext(request))
@login_required()
def movimientos(request):
    return render_to_response('admin/djangoISSSTE/movimientos.html', locals(),
                                 context_instance=RequestContext(request))
@login_required()
def usuarios(request):
    return render_to_response('admin/djangoISSSTE/usuarios.html', locals(),
                                 context_instance=RequestContext(request))
@login_required()
def catalogos(request):
    return render_to_response('admin/djangoISSSTE/catalogos.html', locals(),
                              context_instance=RequestContext(request))

@login_required()
def consulta_web(request):

    print request.user.usuario.rol

    usuario = request.user.usuario
    if usuario.rol == 'AG' or usuario.rol == 'UR' or usuario.rol == 'FR':
        estados = Estado.objects.all()
        municipios = Municipio.objects.all()
    else:
        estados = Estado.objects.filter(id=usuario.estado.id)
        municipios = Municipio.objects.filter(estado_id = usuario.estado.id)


    #templates = loader.get_template('consultas/busqueda_general.html')
    template = loader.get_template('admin/djangoISSSTE/consulta_filtros/consulta-filtros.html')
    context = RequestContext(request, {
        'carencias': Carencia.objects.all(),
        'subcarencias': SubCarencia.objects.all(),
        'acciones': AccionEstrategica.objects.all(),
        'estados': estados,
        'municipios': municipios,
        'periodos': Periodo.objects.all(),
        'meses': Mes.objects.all(),
        'responsables': Responsable.objects.all(),
    })
    return HttpResponse(template.render(context))