from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, NoteSerializer, TagSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note, Tag
from rest_framework.parsers import MultiPartParser, FileUploadParser, FormParser
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.conf import settings
import os



# Create your views here.

class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    parser_classes = [MultiPartParser,FileUploadParser,FormParser]
    permission_classes = [IsAuthenticated]


    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)


class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser,FormParser]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)



class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny,]


class TagListCreate(generics.ListCreateAPIView):
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Tag.objects.filter(creater=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(creater=self.request.user)
        else:
            print(serializer.errors)



def download_file(request, pk):
    note = get_object_or_404(Note, pk=pk)
    if note.file:
        file_path = note.file.path
        with open(file_path, 'rb') as file:
            response = HttpResponse(file.read(), content_type='application/octet-stream')
            response['Content-Disposition'] = f'attachment; filename="{note.file_name}"'
            return response
    else:
        return HttpResponse("File not found", status=404)