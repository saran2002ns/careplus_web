package com.qt.careplus.appointment;

import java.time.LocalDate;

import com.qt.careplus.doctor.Doctor;
import com.qt.careplus.patient.Patient;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor

public class AppoimentDTO {
    private Long id;
    private LocalDate date;
    private String time;
    private Patient patient;
    private Doctor docter;
}
