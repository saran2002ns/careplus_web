package com.qt.careplus.doctor.doctordate;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface DoctorDateRepository extends JpaRepository<DoctorDate, Long> {

    List<DoctorDate> findByDoctorId(Long doctorId);

    @Query("SELECT dd FROM DoctorDate dd JOIN FETCH dd.timeSlots WHERE dd.doctor.id = :doctorId")
    List<DoctorDate> findDatesWithTimeSlots(@Param("doctorId") Long doctorId);

}
