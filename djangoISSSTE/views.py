from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from oauth2_provider.models import AccessToken
from djangoISSSTE.tools import *


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
def redirect_admin(request):
    return redirect('admin/')


@login_required()
def secret_page(request, *args, **kwargs):
    return HttpResponse('Secret contents!', status=200)


@login_required()
def test(request):
    print request.user.usuario.estado

    return HttpResponse('Secret contents!', status=200)