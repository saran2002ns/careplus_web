package com.qt.careplus.patient;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository<Patient, Long> {

    Optional<Patient> findById(Integer patientId);
}
