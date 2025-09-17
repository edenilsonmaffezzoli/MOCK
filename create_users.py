#!/usr/bin/env python
import os
import sys
import django
from datetime import date

# Configurar o Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'HomeServices_project.settings')
django.setup()

from django.contrib.auth.models import User
from HomeServices_app.models import users, workers, City

def create_users():
    print("=== Criando Usuários para o Sistema Serviço em Casa ===\n")
    
    # Criar cidade padrão se não existir
    city, created = City.objects.get_or_create(
        name="São Paulo",
        defaults={'state': "São Paulo"}
    )
    
    # 1. CRIAR USUÁRIO PRESTADOR DE SERVIÇOS
    print("1. Criando usuário PRESTADOR DE SERVIÇOS...")
    
    # Criar User base para prestador
    if User.objects.filter(username='prestador_joao').exists():
        User.objects.filter(username='prestador_joao').delete()
        
    prestador_user = User.objects.create_user(
        username='prestador_joao',
        email='joao.prestador@servicoemcasa.com',
        password='prestador123',
        first_name='João',
        last_name='Silva'
    )
    
    # Criar perfil de worker (prestador)
    worker = workers.objects.create(
        admin=prestador_user,
        contact_number='11987654321',
        dob=date(1985, 5, 15),
        Address='Rua das Flores, 123, Vila Madalena',
        city='São Paulo',
        gender='Masculino',
        designation='Eletricista',
        acc_activation=True,
        avalability_status=True
    )
    
    print(f"✅ Prestador criado com sucesso!")
    print(f"   Nome: {prestador_user.first_name} {prestador_user.last_name}")
    print(f"   Usuário: {prestador_user.username}")
    print(f"   Email: {prestador_user.email}")
    print(f"   Especialidade: {worker.designation}")
    print(f"   Status: {'Ativo' if worker.acc_activation else 'Inativo'}")
    
    # 2. CRIAR USUÁRIO CLIENTE
    print("\n2. Criando usuário CLIENTE...")
    
    # Criar User base para cliente
    if User.objects.filter(username='cliente_maria').exists():
        User.objects.filter(username='cliente_maria').delete()
        
    cliente_user = User.objects.create_user(
        username='cliente_maria',
        email='maria.cliente@gmail.com',
        password='cliente123',
        first_name='Maria',
        last_name='Santos'
    )
    
    # Criar perfil de user (cliente)
    cliente = users.objects.create(
        admin=cliente_user,
        contact_number='11912345678',
        Address='Avenida Paulista, 456, Bela Vista',
        gender='Feminino'
    )
    
    print(f"✅ Cliente criado com sucesso!")
    print(f"   Nome: {cliente_user.first_name} {cliente_user.last_name}")
    print(f"   Usuário: {cliente_user.username}")
    print(f"   Email: {cliente_user.email}")
    print(f"   Endereço: {cliente.Address}")
    
    print("\n=== CREDENCIAIS DOS USUÁRIOS CRIADOS ===")
    print("\n🔧 PRESTADOR DE SERVIÇOS:")
    print(f"   Usuário: prestador_joao")
    print(f"   Senha: prestador123")
    print(f"   Tipo: Eletricista")
    
    print("\n👤 CLIENTE:")
    print(f"   Usuário: cliente_maria")
    print(f"   Senha: cliente123")
    print(f"   Tipo: Cliente")
    
    print("\n✅ Ambos os usuários foram criados com sucesso!")
    print("💡 Use essas credenciais para fazer login no sistema.")

if __name__ == '__main__':
    create_users()