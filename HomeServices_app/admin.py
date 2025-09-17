from django.contrib import admin
from .models import users, workers, Country, State, City, ServiceCatogarys, ServiceRequests, Response, Feedback, Profile

# Configuração do site admin
admin.site.site_header = "Administração Home Services"
admin.site.site_title = "Admin Home Services"
admin.site.index_title = "Painel Administrativo"

# Configurações dos modelos admin
@admin.register(users)
class UsersAdmin(admin.ModelAdmin):
    list_display = ['admin', 'contact_number', 'gender', 'created_at']
    list_filter = ['gender', 'created_at']
    search_fields = ['admin__username', 'contact_number']
    verbose_name = "Usuário"
    verbose_name_plural = "Usuários"

@admin.register(workers)
class WorkersAdmin(admin.ModelAdmin):
    list_display = ['admin', 'contact_number', 'city', 'designation', 'acc_activation', 'avalability_status']
    list_filter = ['acc_activation', 'avalability_status', 'gender', 'city']
    search_fields = ['admin__username', 'contact_number', 'designation']
    verbose_name = "Trabalhador"
    verbose_name_plural = "Trabalhadores"

@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']
    verbose_name = "País"
    verbose_name_plural = "Países"

@admin.register(State)
class StateAdmin(admin.ModelAdmin):
    list_display = ['name', 'country']
    list_filter = ['country']
    search_fields = ['name']
    verbose_name = "Estado"
    verbose_name_plural = "Estados"

@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ['name', 'state']
    list_filter = ['state']
    search_fields = ['name']
    verbose_name = "Cidade"
    verbose_name_plural = "Cidades"

@admin.register(ServiceCatogarys)
class ServiceCatogarysAdmin(admin.ModelAdmin):
    list_display = ['Name', 'Description']
    search_fields = ['Name']
    verbose_name = "Categoria de Serviço"
    verbose_name_plural = "Categorias de Serviços"

@admin.register(ServiceRequests)
class ServiceRequestsAdmin(admin.ModelAdmin):
    list_display = ['user', 'service', 'city', 'status', 'dateofrequest']
    list_filter = ['status', 'service', 'city', 'dateofrequest']
    search_fields = ['user__admin__username', 'Problem_Description']
    verbose_name = "Solicitação de Serviço"
    verbose_name_plural = "Solicitações de Serviços"

@admin.register(Response)
class ResponseAdmin(admin.ModelAdmin):
    list_display = ['requests', 'assigned_worker', 'Date', 'status']
    list_filter = ['status', 'Date']
    search_fields = ['assigned_worker__admin__username']
    verbose_name = "Resposta"
    verbose_name_plural = "Respostas"

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ['User', 'Employ', 'Rating', 'Date']
    list_filter = ['Rating', 'Date']
    search_fields = ['User__username', 'Employ__admin__username']
    verbose_name = "Avaliação"
    verbose_name_plural = "Avaliações"

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ['user']
    search_fields = ['user__username']
    verbose_name = "Perfil"
    verbose_name_plural = "Perfis"
