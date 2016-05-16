"""
Django settings for Projects project.

Generated by 'django-admin startproject' using Django 1.9.1.

For more information on this file, see
https://docs.djangoproject.com/en/1.9/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.9/ref/settings/
"""

import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.9/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '7c$*7lp@_9igh)og*w7cd4c023*g^jccrg&_(fb_#mvj-w&stk'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

TEMPLATE_DEBUG = True

ALLOWED_HOSTS = ['www.inclusionissste.mx']

ADMIN_TOOLS_MENU = 'menu.CustomMenu'


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'djangoISSSTE',
    'oauth2_provider',
    'corsheaders',
    'nested_inline',
    'smart_selects',
]

AUTHENTICATION_BACKENDS = (
    'oauth2_provider.backends.OAuth2Backend',
    # Uncomment following if you want to access the admin
    'django.contrib.auth.backends.ModelBackend'
)

MIDDLEWARE_CLASSES = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'oauth2_provider.middleware.OAuth2TokenMiddleware',
]



CORS_ORIGIN_ALLOW_ALL = True

ROOT_URLCONF = 'Projects.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'djangoISSSTE/templates/')]
        ,
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

TEMPLATE_CONTEXT_PROCESSORS = (
    'django.core.context_processors.request',
    'django.contrib.auth.context_processors.auth',
)


WSGI_APPLICATION = 'Projects.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.9/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'issste',
        'USER': 'inclusion',
        'PASSWORD': 'inclusion',
        'HOST': '',
        'PORT': '',
    }
}

# Parse database configuration from $DATABASE_URL
#import dj_database_url

#DATABASES['default'] = dj_database_url.config()

# Password validation
# https://docs.djangoproject.com/en/1.9/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]



# vida del token
SESSION_COOKIE_AGE = 35900
SESSION_EXPIRE_AT_BROWSER_CLOSE = True

LOGIN_URL = '/admin/login/'

# Internationalization
# https://docs.djangoproject.com/en/1.9/topics/i18n/

LANGUAGE_CODE = 'es-MX'

TIME_ZONE = 'America/Mexico_City'

USE_I18N = True

USE_L10N = True

USE_TZ = True



PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.9/howto/static-files
STATIC_URL = '/static/'

STATIC_ROOT = os.path.join(PROJECT_ROOT, 'Projects/staticfiles')

STATICFILES_DIRS = (
    os.path.join(PROJECT_ROOT, '/djangoISSSTE/static'),
)



MEDIA_ROOT = os.path.join(PROJECT_ROOT, 'djangoISSSTE/media/tutorialesPDF')
MEDIA_URL = '/media/'


TEMPLATE_DIRS = (
    os.path.join(PROJECT_ROOT,  'djangoISSSTE/templates/'),
)

TEMPLATETAGS_DIRS = (
    os.path.join(BASE_DIR, 'djangoISSSTE/templatetags/'),
)



EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

EMAIL_HOST = 'mail.inclusionissste.mx'
EMAIL_HOST_USER = 'inclusioni'
EMAIL_HOST_PASSWORD = 'CbxxdWaz'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
