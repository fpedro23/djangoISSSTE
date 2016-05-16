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
def ayuda(request):
    return render_to_response('admin/djangoISSSTE/ayuda/c_ayuda.html', locals(),
                              context_instance=RequestContext(request))

@login_required()
def videos(request):
    return render_to_response('admin/djangoISSSTE/videos/videos_lista.html', locals(),
                              context_instance=RequestContext(request))

@login_required()
def manualesPdf(request):
    return render_to_response('admin/obras/manuales/manuales_lista.html', locals(),
                              context_instance=RequestContext(request))


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
    #usuario = get_usuario_for_token(request.GET.get('access_token'))
    if usuario.rol == 'AG' or usuario.rol == 'FC' or usuario.rol == 'UC':
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
        'unidadesMedida': UnidadDeMedida.objects.all(),
        'estados': estados,
        'municipios': municipios,
        'periodos': Periodo.objects.all(),
        'meses': Mes.objects.all(),
        'responsables': Responsable.objects.all(),
    })
    return HttpResponse(template.render(context))

@login_required()
def ver_video(request):
    cualVideo=request.GET.get('cualVideo', None),
    print(str(cualVideo[0]))

    if str(cualVideo[0]) =='iniciarSesion.mp4':
        tituloVideo='Inicio de Sesion',
    elif str(cualVideo[0]) =='modificacionObra.mp4':
        tituloVideo='Modificar una Obra',


    elif str(cualVideo[0]) =='consultaFiltros.mp4':
        tituloVideo='Consulta Mediante Filtros',
    elif str(cualVideo[0]) =='consultaPredefinida.mp4':
        tituloVideo='Consulta Predefinidos',

    elif str(cualVideo[0]) =='agregarClasificacion.mp4':
        tituloVideo='Agregar una Clasificacion',
    elif str(cualVideo[0]) =='buscarClasificacion.mp4':
        tituloVideo='Buscar una Clasificacion',
    elif str(cualVideo[0]) =='modificarClasificacion.mp4':
        tituloVideo='Modificar una Clasificacion',
    elif str(cualVideo[0]) =='eliminarClasificacion.mp4':
        tituloVideo='Eliminar una Clasificacion',

    elif str(cualVideo[0]) =='crearUsuario.mp4':
        tituloVideo='Agregar un Usuario',
    elif str(cualVideo[0]) =='modificarUsuario.mp4':
        tituloVideo='Modificar un Usuario',
    elif str(cualVideo[0]) =='buscarUsuario.mp4':
        tituloVideo='Buscar un Usuario',
    elif str(cualVideo[0]) =='eliminarUsuario.mp4':
        tituloVideo='Eliminar un Usuario',

    elif str(cualVideo[0]) =='agregarDependencia.mp4':
        tituloVideo='Agregar una Dependencia',
    elif str(cualVideo[0]) =='buscarDependencia.mp4':
        tituloVideo='Buscar una Dependencia',
    elif str(cualVideo[0]) =='modificarDependencia.mp4':
        tituloVideo='Modificar una Dependencia',
    elif str(cualVideo[0]) =='eliminarDependencia.mp4':
        tituloVideo='Eliminar una Dependencia',

    elif str(cualVideo[0]) =='agregarSubDependencia.mp4':
        tituloVideo='Agregar una SubDependencia',
    elif str(cualVideo[0]) =='buscarSubDependencia.mp4':
        tituloVideo='Buscar una SubDependencia',
    elif str(cualVideo[0]) =='modificarSubDependencia.mp4':
        tituloVideo='Modificar una SubDependencia',
    elif str(cualVideo[0]) =='eliminarSubDependencia.mp4':
        tituloVideo='Eliminar una SubDependencia',


    elif str(cualVideo[0]) =='agregarInversion.mp4':
        tituloVideo='Agregar un tipo de Inversion',
    elif str(cualVideo[0]) =='buscarInversion.mp4':
        tituloVideo='Buscar un tipo de Inversion',
    elif str(cualVideo[0]) =='modificarInversion.mp4':
        tituloVideo='Modificar un tipo de Inversion',
    elif str(cualVideo[0]) =='eliminarInversion.mp4':
        tituloVideo='Eliminar un tipo de Inversion',

    elif str(cualVideo[0]) =='agregarImpacto.mp4':
        tituloVideo='Agregar un tipo de Impacto',
    elif str(cualVideo[0]) =='buscarImpacto.mp4':
        tituloVideo='Buscar un un tipo de Impacto',
    elif str(cualVideo[0]) =='modificarImpacto.mp4':
        tituloVideo='Modificar un un tipo de Impacto',
    elif str(cualVideo[0]) =='eliminarImpacto.mp4':
        tituloVideo='Eliminar un un tipo de Impacto',

    elif str(cualVideo[0]) =='agregarInaugurador.mp4':
        tituloVideo='Agregar un Inaugurador',
    elif str(cualVideo[0]) =='buscarInaugurador.mp4':
        tituloVideo='Buscar un Inaugurador',
    elif str(cualVideo[0]) =='modificarInaugurador.mp4':
        tituloVideo='Modificar un Inaugurador',
    elif str(cualVideo[0]) =='eliminarInaugurador.mp4':
        tituloVideo='Eliminar un Inaugurador',

    template = loader.get_template('admin/djangoISSSTE/videos/videos_lista.html')
    context = RequestContext(request, {
        'cualVideo': cualVideo,
        'tituloVideo': tituloVideo,
    })
    return HttpResponse(template.render(context))

@login_required()
def manuales(request):
    return render_to_response('admin/djangoISSSTE/manuales/manuales_lista.html', locals(),
                              context_instance=RequestContext(request))