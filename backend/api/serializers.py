from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note, Tag

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password')
        extra_kwargs = {'password':{'write_only':True, 'required':True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ('id','content','file','file_name','tags','created_at','author')
        extra_kwargs = {'author':{'read_only':True}}

        def validate(self, data):
            if 'file' in data and data['file'] is None:
                del data['file']
                del data['file_name']

        def tag_validate(self, data):
            if 'tags' in data and data['tags'] is None:
                del data['tags']

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('id', 'name', 'creater')
        extra_kwargs = {'creater':{'read_only':True}}

