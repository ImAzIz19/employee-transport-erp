package net.sindibadgroup.ltms.service.bill;

import java.io.ByteArrayOutputStream;

public interface BillService {
    byte[] generateBillExcel(Long agencyId, int year, int month);
}
