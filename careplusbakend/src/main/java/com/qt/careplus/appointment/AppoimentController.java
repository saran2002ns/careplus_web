package com.qt.careplus.appointment;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.qt.careplus.doctor.DoctorRepository;
import com.qt.careplus.patient.PatientRepository;

import java.util.List;

@RestController
@RequestMapping("/api/appoiments")
@RequiredArgsConstructor
public class AppoimentController {

    private final DoctorRepository doctorRepository;
    private final AppoimentRepository appoimentRepository;
    private final PatientRepository patientRepository;

    @PostMapping
    public ResponseEntity<String> createAppointment(@RequestBody Appoiment appoiment) {
        try {
            appoimentRepository.save(appoiment);
            return ResponseEntity.ok("Appointment created successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Failed to create appointment: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateAppointment(@PathVariable Long id, @RequestBody Appoiment updated) {
        try {
            Appoiment existing = appoimentRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Appointment not found"));

            existing.setDate(updated.getDate());
            existing.setTime(updated.getTime());
            existing.setPatientId(updated.getPatientId());
            existing.setDocterId(updated.getDocterId());

            appoimentRepository.save(existing);
            return ResponseEntity.ok("Appointment updated successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Failed to update appointment: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAppointment(@PathVariable Long id) {
        try {
            Appoiment existing = appoimentRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Appointment not found"));

            appoimentRepository.delete(existing);
            return ResponseEntity.ok("Appointment deleted successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Failed to delete appointment: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<AppoimentDTO>> getAllAppointments() {
        try {
            List<AppoimentDTO> list = appoimentRepository.findAll().stream()
                    .map(this::toDTO)
                    .toList();
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppoimentDTO> getAppointmentById(@PathVariable Long id) {
        try {
            Appoiment appoiment = appoimentRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Appointment not found"));
            return ResponseEntity.ok(toDTO(appoiment));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(null);
        }
    }

    private AppoimentDTO toDTO(Appoiment entity) {
        AppoimentDTO dto = new AppoimentDTO();
        dto.setId(entity.getId());
        dto.setDate(entity.getDate());
        dto.setTime(entity.getTime());
        dto.setPatient(patientRepository.findById(entity.getPatientId()).orElse(null));
        dto.setDocter(doctorRepository.findById(entity.getDocterId()).orElse(null));
        return dto;
    }
}
