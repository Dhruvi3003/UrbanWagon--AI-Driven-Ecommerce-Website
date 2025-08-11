from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    name = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=[('admin', 'Admin'), ('customer', 'Customer')], default='customer')

    class Meta:
        model = User
        fields = ['name', 'email', 'password', 'role']

    def create(self, validated_data):
        user = User.objects.create_user(
            name=validated_data['name'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data.get('role', 'customer'),
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            user = authenticate(request=self.context.get('request'), username=email, password=password)
            if not user:
                raise serializers.ValidationError("Invalid email or password")
        else:
            raise serializers.ValidationError("Both email and password are required")

        data['user'] = user
        return data

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'name',
            'role',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
