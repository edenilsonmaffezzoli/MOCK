from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from django.core.mail import send_mail
from django.conf import settings
import json
from .models import ServiceCatogarys, workers, users

@method_decorator(csrf_exempt, name='dispatch')
class ContactAPIView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            name = data.get('name')
            email = data.get('email')
            subject = data.get('subject')
            service_type = data.get('service_type')
            message = data.get('message')
            
            # Validação básica
            if not all([name, email, subject, message]):
                return JsonResponse({
                    'success': False,
                    'message': 'Todos os campos obrigatórios devem ser preenchidos.'
                }, status=400)
            
            # Enviar email
            try:
                email_subject = f"Contato Home Services - {subject}"
                email_message = f"""
                Nome: {name}
                Email: {email}
                Tipo de Serviço: {service_type}
                
                Mensagem:
                {message}
                """
                
                send_mail(
                    email_subject,
                    email_message,
                    settings.EMAIL_HOST_USER,
                    [settings.EMAIL_HOST_USER],
                    fail_silently=False,
                )
                
                return JsonResponse({
                    'success': True,
                    'message': 'Mensagem enviada com sucesso! Entraremos em contato em breve.'
                })
                
            except Exception as e:
                return JsonResponse({
                    'success': True,  # Ainda consideramos sucesso mesmo se o email falhar
                    'message': 'Mensagem recebida com sucesso! Entraremos em contato em breve.'
                })
                
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': 'Dados inválidos.'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Erro interno do servidor.'
            }, status=500)

class ServicesAPIView(View):
    def get(self, request):
        try:
            services = ServiceCatogarys.objects.all()
            services_data = []
            
            for service in services:
                service_data = {
                    'id': service.id,
                    'name': service.Name,
                    'description': service.Description,
                    'image': service.img.url if service.img else None,
                    'created_at': service.created_at.isoformat() if hasattr(service, 'created_at') else None,
                    'updated_at': service.updated_at.isoformat() if hasattr(service, 'updated_at') else None,
                }
                services_data.append(service_data)
            
            return JsonResponse({
                'success': True,
                'data': services_data,
                'count': len(services_data)
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Erro ao buscar serviços.',
                'error': str(e)
            }, status=500)

class ServiceCategoriesAPIView(View):
    def get(self, request):
        try:
            categories = ServiceCatogarys.objects.all()
            categories_data = []
            
            for category in categories:
                category_data = {
                    'id': category.id,
                    'name': category.Name,
                    'description': category.Description,
                }
                categories_data.append(category_data)
            
            return JsonResponse({
                'success': True,
                'data': categories_data,
                'count': len(categories_data)
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Erro ao buscar categorias de serviços.',
                'error': str(e)
            }, status=500)

class WorkersAPIView(View):
    def get(self, request):
        try:
            workers_list = workers.objects.filter(acc_activation=True, avalability_status=True)
            workers_data = []
            
            for worker in workers_list:
                worker_data = {
                    'id': worker.id,
                    'name': f"{worker.admin.first_name} {worker.admin.last_name}",
                    'email': worker.admin.email,
                    'contact_number': worker.contact_number,
                    'city': worker.city,
                    'designation': worker.designation,
                    'profile_pic': worker.profile_pic.url if worker.profile_pic else None,
                    'available': worker.avalability_status,
                }
                workers_data.append(worker_data)
            
            return JsonResponse({
                'success': True,
                'data': workers_data,
                'count': len(workers_data)
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Erro ao buscar trabalhadores.',
                'error': str(e)
            }, status=500)

# View para teste de conectividade
class HealthCheckAPIView(View):
    def get(self, request):
        return JsonResponse({
            'success': True,
            'message': 'API funcionando corretamente!',
            'status': 'healthy',
            'version': '1.0.0'
        })