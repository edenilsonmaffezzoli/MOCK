#!/usr/bin/env python
import os
import sys
import django

# Configurar o Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'HomeServices_project.settings')
django.setup()

from HomeServices_app.models import ServiceCatogarys, Country, State, City

def create_sample_data():
    print("=== CRIANDO DADOS DE EXEMPLO ===\n")
    
    # Criar país, estado e cidade se não existirem
    country, created = Country.objects.get_or_create(name="Brasil")
    if created:
        print("✓ País 'Brasil' criado")
    else:
        print("✓ País 'Brasil' já existe")
    
    state, created = State.objects.get_or_create(
        country=country,
        name="São Paulo"
    )
    if created:
        print("✓ Estado 'São Paulo' criado")
    else:
        print("✓ Estado 'São Paulo' já existe")
    
    city, created = City.objects.get_or_create(
        state="São Paulo",
        name="São Paulo"
    )
    if created:
        print("✓ Cidade 'São Paulo' criada")
    else:
        print("✓ Cidade 'São Paulo' já existe")
    
    # Criar serviços de exemplo
    services_data = [
        {
            "Name": "Eletricista",
            "Description": "Serviços de instalação e manutenção elétrica residencial e comercial. Inclui instalação de tomadas, interruptores, quadros elétricos e reparos em geral."
        },
        {
            "Name": "Encanador",
            "Description": "Serviços de encanamento e hidráulica. Instalação e reparo de torneiras, chuveiros, vasos sanitários, desentupimento e vazamentos."
        },
        {
            "Name": "Pintor",
            "Description": "Serviços de pintura residencial e comercial. Pintura de paredes, tetos, portões, grades e aplicação de texturas decorativas."
        },
        {
            "Name": "Marceneiro",
            "Description": "Serviços de marcenaria e carpintaria. Fabricação e reparo de móveis, portas, janelas, armários planejados e estruturas de madeira."
        },
        {
            "Name": "Limpeza Doméstica",
            "Description": "Serviços de limpeza residencial completa. Limpeza de ambientes, organização, lavagem de roupas e manutenção da casa."
        },
        {
            "Name": "Jardinagem",
            "Description": "Serviços de jardinagem e paisagismo. Manutenção de jardins, poda de plantas, plantio, irrigação e design de espaços verdes."
        }
    ]
    
    print("\n--- Criando Categorias de Serviços ---")
    for service_data in services_data:
        service, created = ServiceCatogarys.objects.get_or_create(
            Name=service_data["Name"],
            defaults={
                "Description": service_data["Description"],
                "img": "catogry_imgs/default.jpg"  # Imagem padrão
            }
        )
        
        if created:
            print(f"✓ Serviço '{service_data['Name']}' criado")
        else:
            print(f"✓ Serviço '{service_data['Name']}' já existe")
    
    # Verificar totais
    total_countries = Country.objects.count()
    total_states = State.objects.count()
    total_cities = City.objects.count()
    total_services = ServiceCatogarys.objects.count()
    
    print(f"\n=== RESUMO DOS DADOS ===")
    print(f"Total de países: {total_countries}")
    print(f"Total de estados: {total_states}")
    print(f"Total de cidades: {total_cities}")
    print(f"Total de serviços: {total_services}")
    
    print(f"\n✓ Dados de exemplo criados com sucesso!")
    print(f"O sistema agora possui {total_services} categorias de serviços disponíveis.")

if __name__ == "__main__":
    create_sample_data()