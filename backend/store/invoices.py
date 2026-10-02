import io
from decimal import Decimal
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

def generate_order_invoice_pdf(order):
    """
    Generates a professional PDF invoice for a toomakt order.
    Returns bytes of the generated PDF.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Custom styles
    brand_title_style = ParagraphStyle(
        'BrandTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.HexColor('#C26715')
    )
    brand_sub_style = ParagraphStyle(
        'BrandSub',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#705335')
    )
    invoice_header_style = ParagraphStyle(
        'InvHeader',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        alignment=2,  # Right aligned
        textColor=colors.HexColor('#2B170E')
    )
    meta_style = ParagraphStyle(
        'MetaText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        alignment=2,
        textColor=colors.HexColor('#555555')
    )
    section_title_style = ParagraphStyle(
        'SectionTitle',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#2B170E')
    )
    cell_style = ParagraphStyle(
        'CellText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#2B170E')
    )
    cell_bold_style = ParagraphStyle(
        'CellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#2B170E')
    )

    elements = []

    # 1. Header: Brand (Left) & Invoice Title/Number (Right)
    brand_para = Paragraph("<b>toomakt</b><br/><font size='9' color='#8B5E3C'>FRUIT FLAVORED TOFFEE CONFECTIONERY<br/>Atelier Cairo & Alexandria, Egypt<br/>bonjour@toomakt.com | www.toomakt.com</font>", brand_title_style)
    
    order_date = order.created_at.strftime('%Y-%m-%d %H:%M') if hasattr(order, 'created_at') and order.created_at else '2026-09-28'
    payment_method_label = "InstaPay / Bank Transfer" if getattr(order, 'payment_method', 'cod') == 'instapay' else ("Cash on Delivery (COD)" if getattr(order, 'payment_method', 'cod') == 'cod' else "Online Payment")
    payment_status_label = "PAID (Verified)" if getattr(order, 'payment_status', 'pending') == 'paid' else ("Waiting Verification" if getattr(order, 'payment_status', 'pending') == 'waiting_verification' else "Pending Payment")
    order_status_label = order.get_status_display() if hasattr(order, 'get_status_display') else str(getattr(order, 'status', 'Pending')).title()

    inv_para = Paragraph(f"<b>INVOICE</b><br/><font size='9' color='#555555'>Invoice No: <b>INV-{order.order_number}</b><br/>Order Reference: <b>{order.order_number}</b><br/>Date: {order_date}<br/>Payment: <b>{payment_method_label}</b><br/>Payment Status: <b>{payment_status_label}</b><br/>Order Status: <b>{order_status_label}</b></font>", invoice_header_style)
    
    header_table = Table([[brand_para, inv_para]], colWidths=[3.5 * inch, 4.0 * inch])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
    ]))
    elements.append(header_table)

    elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#C26715'), spaceBefore=5, spaceAfter=15))

    # 2. Customer & Delivery Address details
    building_info = f", Bldg: {order.building_number}" if getattr(order, 'building_number', '') else ""
    apt_info = f", Apt/Floor: {order.apartment_floor}" if getattr(order, 'apartment_floor', '') else ""
    notes_info = f"<br/><b>Delivery Notes:</b> {order.delivery_notes}" if getattr(order, 'delivery_notes', '') else ""

    payment_note = "* Please prepare exact cash on arrival." if getattr(order, 'payment_method', 'cod') == 'cod' else "* Payment verified. No payment required at courier delivery."

    customer_html = f"""
    <b>Bill & Ship To:</b><br/>
    <b>Name:</b> {order.customer_name}<br/>
    <b>Mobile:</b> {order.customer_phone or 'N/A'}<br/>
    <b>Email:</b> {order.customer_email}<br/>
    <b>Governorate:</b> {getattr(order, 'governorate', 'Cairo')}, Egypt<br/>
    <b>City:</b> {order.shipping_city or getattr(order, 'governorate', 'Cairo')}<br/>
    <b>Address:</b> {order.shipping_address}{building_info}{apt_info}
    {notes_info}
    """

    shipping_method_html = f"""
    <b>Delivery Service:</b><br/>
    <b>Zone:</b> {getattr(order, 'governorate', 'Cairo')} Express Courier (Egypt Only)<br/>
    <b>Estimated Arrival:</b> 1–3 Business Days<br/>
    <b>Payment Method:</b> {payment_method_label}<br/>
    <b>Courier Fee:</b> {float(order.shipping_fee):.2f} EGP<br/>
    <font color="#994709"><b>{payment_note}</b></font>
    """

    cust_para = Paragraph(customer_html, cell_style)
    ship_para = Paragraph(shipping_method_html, cell_style)
    cust_table = Table([[cust_para, ship_para]], colWidths=[3.8 * inch, 3.7 * inch])
    cust_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#FDFBF7')),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#EADCCB')),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ]))
    elements.append(cust_table)
    elements.append(Spacer(1, 15))

    # 3. Order Items Table
    elements.append(Paragraph("<b>Ordered Products & Confectionery Packs</b>", section_title_style))
    elements.append(Spacer(1, 6))

    table_data = [
        [
            Paragraph("<b>Product Description</b>", cell_bold_style),
            Paragraph("<b>Packs</b>", cell_bold_style),
            Paragraph("<b>Pieces / Pack</b>", cell_bold_style),
            Paragraph("<b>Unit Price</b>", cell_bold_style),
            Paragraph("<b>Total (EGP)</b>", cell_bold_style),
        ]
    ]

    items = order.items.all() if hasattr(order, 'items') else []
    for item in items:
        p_name = getattr(item, 'product_name_snapshot', '') or item.name
        pieces = getattr(item, 'pieces_per_pack_snapshot', 20)
        table_data.append([
            Paragraph(f"<b>{p_name}</b>", cell_style),
            Paragraph(f"{item.quantity} pack(s)", cell_style),
            Paragraph(f"{pieces} pieces", cell_style),
            Paragraph(f"{float(item.unit_price):.2f} EGP", cell_style),
            Paragraph(f"{float(item.total_price):.2f} EGP", cell_bold_style),
        ])

    items_table = Table(table_data, colWidths=[3.2 * inch, 0.9 * inch, 1.1 * inch, 1.1 * inch, 1.2 * inch])
    items_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#FAF0E4')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#2B170E')),
        ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
        ('ALIGN', (3, 0), (-1, -1), 'RIGHT'),
        ('ALIGN', (4, 0), (-1, -1), 'RIGHT'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('LINEBELOW', (0, 0), (-1, 0), 1, colors.HexColor('#C26715')),
        ('LINEBELOW', (0, 1), (-1, -1), 0.5, colors.HexColor('#EFE5D8')),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    elements.append(items_table)
    elements.append(Spacer(1, 12))

    # 4. Financial Summary
    summary_data = [
        [Paragraph("Product Subtotal:", cell_style), Paragraph(f"<b>{float(order.subtotal):.2f} EGP</b>", cell_style)],
        [Paragraph(f"Shipping ({getattr(order, 'governorate', 'Cairo')}):", cell_style), Paragraph(f"<b>{float(order.shipping_fee):.2f} EGP</b>", cell_style)],
    ]
    if getattr(order, 'discount_amount', 0) and float(order.discount_amount) > 0:
        summary_data.append([Paragraph(f"Promo Discount ({getattr(order, 'promo_code', '')}):", cell_style), Paragraph(f"<b>-{float(order.discount_amount):.2f} EGP</b>", cell_style)])

    summary_data.append([
        Paragraph("<b>Total Amount Due:</b>", ParagraphStyle('TotalLabel', parent=styles['Normal'], fontSize=11, fontName='Helvetica-Bold', textColor=colors.HexColor('#994709'))),
        Paragraph(f"<b>{float(order.total_amount):.2f} EGP</b>", ParagraphStyle('TotalVal', parent=styles['Normal'], fontSize=11, fontName='Helvetica-Bold', textColor=colors.HexColor('#994709'), alignment=2))
    ])

    summary_table = Table(summary_data, colWidths=[5.5 * inch, 2.0 * inch])
    summary_table.setStyle(TableStyle([
        ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LINEABOVE', (0, -1), (-1, -1), 1, colors.HexColor('#C26715')),
    ]))
    elements.append(summary_table)

    elements.append(Spacer(1, 20))
    elements.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#EADCCB'), spaceBefore=5, spaceAfter=10))

    footer_text = Paragraph(
        "<font size='8' color='#705335'>Thank you for choosing toomakt! All toffee confections are freshly prepared using pure fruit purées and French butter.<br/>Questions or wholesale inquiries? Contact us at bonjour@toomakt.com or call +20 100 000 0000.<br/>Terms: Cash on Delivery strictly in Egyptian Pounds (EGP). Please inspect goods upon courier arrival.</font>",
        ParagraphStyle('Footer', parent=styles['Normal'], alignment=1)
    )
    elements.append(footer_text)

    doc.build(elements)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
