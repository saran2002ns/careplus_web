package com.qt.careplus.doctor.doctordate;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.qt.careplus.doctor.Doctor;
import com.qt.careplus.doctor.DoctorRepository;
import com.qt.careplus.doctor.doctortime.TimeSlot;
import com.qt.careplus.doctor.doctortime.TimeSlotDTO;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/dates")
@RequiredArgsConstructor
public class DoctorDateController {

    private final DoctorDateRepository doctorDateRepository;
    private final DoctorRepository doctorRepository;

    @PostMapping
    public ResponseEntity<String> addDoctorDate(@RequestBody DoctorDateDTO request) {
        try {
            Doctor doctor = doctorRepository.findById(request.getDoctorId())
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));

            DoctorDate date = new DoctorDate();
            date.setDoctor(doctor);
            date.setAvailable(request.isAvailable());
            date.setDate(request.getDate());

            List<TimeSlot> slots = request.getTimeSlots().stream().map(slotDTO -> {
                TimeSlot slot = new TimeSlot();
                slot.setTime(slotDTO.getTime());
                slot.setAvailable(slotDTO.isAvailable());
                slot.setDoctorDate(date);
                return slot;
            }).toList();

            date.setTimeSlots(slots);
            doctorDateRepository.save(date);

            return ResponseEntity.ok("Doctor date and time slots added successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Failed to add doctor date: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateDoctorDate(@PathVariable Long id, @RequestBody DoctorDateDTO request) {
        try {
            DoctorDate existing = doctorDateRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Doctor date not found"));

            existing.setAvailable(request.isAvailable());
            existing.setDate(request.getDate());

            if (request.getTimeSlots() != null) {
                existing.getTimeSlots().clear();

                List<TimeSlot> newSlots = request.getTimeSlots().stream().map(dto -> {
                    TimeSlot slot = new TimeSlot();
                    slot.setTime(dto.getTime());
                    slot.setAvailable(dto.isAvailable());
                    slot.setDoctorDate(existing);
                    return slot;
                }).toList();

                existing.getTimeSlots().addAll(newSlots);
            }

            doctorDateRepository.save(existing);
            return ResponseEntity.ok("Doctor date updated successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Failed to update doctor date: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDoctorDate(@PathVariable Long id) {
        try {
            DoctorDate existing = doctorDateRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Doctor date not found"));

            doctorDateRepository.delete(existing);
            return ResponseEntity.ok("Doctor date deleted successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Failed to delete doctor date: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<DoctorDateDTO>> getAllDates() {
        try {
            List<DoctorDate> dates = doctorDateRepository.findAll();
            List<DoctorDateDTO> dtos = dates.stream().map(this::toDTO).toList();
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<DoctorDateDTO> getDateById(@PathVariable Long id) {
        try {
            DoctorDate date = doctorDateRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Doctor date not found"));
            return ResponseEntity.ok(toDTO(date));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    private DoctorDateDTO toDTO(DoctorDate entity) {
        DoctorDateDTO dto = new DoctorDateDTO();
        dto.setDateId(entity.getId());
        dto.setDoctorId(entity.getDoctor().getId());
        dto.setAvailable(entity.isAvailable());
        dto.setDate(entity.getDate());

        List<TimeSlotDTO> slotDTOs = entity.getTimeSlots().stream().map(slot -> {
            TimeSlotDTO s = new TimeSlotDTO();
            s.setTime(slot.getTime());
            s.setAvailable(slot.isAvailable());
            return s;
        }).toList();

        dto.setTimeSlots(slotDTOs);
        return dto;
    }
}
