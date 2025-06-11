package com.engsoftware.apihelpdesk.services;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.engsoftware.apihelpdesk.configs.FileStorageConfig;
import com.engsoftware.apihelpdesk.exception.FileStorageEcxeption;
import com.engsoftware.apihelpdesk.models.HelpdeskModel;

@Service
public class FileStorageService {

    @Autowired
    private HelpdeskService helpdeskService;


    private final Path fileStorageLocation;

    @Autowired
    public FileStorageService(FileStorageConfig fileStorageConfig) {
        this.fileStorageLocation = Paths.get(fileStorageConfig.getUploadDir()).toAbsolutePath().normalize();
        try{
            Files.createDirectories(this.fileStorageLocation);
        }catch(Exception e){
            throw new FileStorageEcxeption("Could not create the directory where the uploaded files will be stored", e);
        }
    }

    public String storeFile(HelpdeskModel helpdesk, MultipartFile file){
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        try{
            if(fileName.contains("..")){
                throw new FileStorageEcxeption("Sorry! Filename contains invalid path sequence " + fileName);
            }

            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            helpdesk.setFileName(fileName);
            helpdeskService.save(helpdesk);
            return fileName;
        }catch(Exception e){
            throw new FileStorageEcxeption("Could not store file " + fileName + ". Please try again!", e);
        }
        
    }

}
