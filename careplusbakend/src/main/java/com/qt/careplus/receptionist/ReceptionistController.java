package com.qt.careplus.receptionist;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/receptionists")
@RequiredArgsConstructor
public class ReceptionistController {

    private final ReceptionistRepository receptionistRepository;

    @GetMapping
    public ResponseEntity<List<Receptionist>> getAllReceptionists() {
        try {
            return ResponseEntity.ok(receptionistRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Receptionist> getReceptionistById(@PathVariable Integer id) {
        try {
            Receptionist rec = receptionistRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Receptionist not found"));
            return ResponseEntity.ok(rec);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping
    public ResponseEntity<String> createReceptionist(@RequestBody Receptionist receptionist) {
        try {
            receptionistRepository.save(receptionist);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Receptionist added successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to add receptionist: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateReceptionist(@PathVariable Integer id, @RequestBody Receptionist updated) {
        try {
            Receptionist existing = receptionistRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Receptionist not found"));

            existing.setName(updated.getName());
            existing.setNumber(updated.getNumber());
            existing.setPassword(updated.getPassword());

            receptionistRepository.save(existing);
            return ResponseEntity.ok("Receptionist updated successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update receptionist: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReceptionist(@PathVariable Integer id) {
        try {
            Receptionist existing = receptionistRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Receptionist not found"));
            receptionistRepository.delete(existing);
            return ResponseEntity.ok("Receptionist deleted successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete receptionist: " + e.getMessage());
        }
    }
}
