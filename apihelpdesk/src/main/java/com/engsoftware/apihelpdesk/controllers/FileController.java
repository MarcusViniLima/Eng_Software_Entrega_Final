package com.engsoftware.apihelpdesk.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.engsoftware.apihelpdesk.dto.UploadFileResponse;
import com.engsoftware.apihelpdesk.models.HelpdeskModel;
import com.engsoftware.apihelpdesk.services.FileStorageService;

@RestController
@RequestMapping("/api/file")
public class FileController {

    @Autowired
    private FileStorageService fileStorageService;

    @RequestMapping("/upload")
    public UploadFileResponse uploadFile(HelpdeskModel helpdesk, @RequestParam("file") MultipartFile file) {

        String fileName = fileStorageService.storeFile(helpdesk,file);
        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/file/download/")
                .path(fileName)
                .toUriString();
                
        return new UploadFileResponse(fileName, fileDownloadUri, file.getContentType(), file.getSize());
        
    }

}
