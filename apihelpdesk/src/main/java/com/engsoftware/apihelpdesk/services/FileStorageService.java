package com.engsoftware.apihelpdesk.services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.engsoftware.apihelpdesk.configs.FileStorageConfig;
import com.engsoftware.apihelpdesk.exception.FileStorageException;
import com.engsoftware.apihelpdesk.models.HelpdeskModel;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;

    @Autowired
    public FileStorageService(FileStorageConfig fileStorageConfig) {
        this.fileStorageLocation = Paths.get(fileStorageConfig.getUploadDir())
                                      .toAbsolutePath()
                                      .normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new FileStorageException("Não foi possível criar o diretório para armazenar os arquivos", ex);
        }
    }

    public Path getFileStorageLocation() {
        return fileStorageLocation;
    }

    public String storeFile(HelpdeskModel helpdesk, MultipartFile file) {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        
        try {
            if (fileName.contains("..")) {
                throw new FileStorageException("Nome do arquivo contém sequência de caminho inválida: " + fileName);
            }
            
            String fileExtension = fileName.substring(fileName.lastIndexOf("."));
            String newFileName = UUID.randomUUID() + fileExtension;
            
            Path targetLocation = this.fileStorageLocation.resolve(newFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            
            return newFileName;
        } catch (IOException ex) {
            throw new FileStorageException("Não foi possível armazenar o arquivo " + fileName, ex);
        }
    }

}
