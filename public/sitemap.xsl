<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title>XML Sitemap | toomakt Artisanal Confectionery Atelier</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style type="text/css">
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background-color: #FAF7F2;
            color: #1A1A1A;
            line-height: 1.6;
            padding: 30px 20px;
          }
          .container {
            max-width: 1100px;
            margin: 0 auto;
            background: #FFFFFF;
            border: 1px solid #E8E2D7;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(60, 19, 34, 0.05);
            overflow: hidden;
          }
          .header {
            background: #3C1322;
            color: #FAF7F2;
            padding: 36px 32px;
          }
          .brand-badge {
            display: inline-block;
            background: rgba(255, 209, 71, 0.2);
            color: #FFD147;
            border: 1px solid rgba(255, 209, 71, 0.4);
            padding: 4px 12px;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            margin-bottom: 12px;
          }
          h1 {
            font-size: 26px;
            font-weight: 600;
            margin-bottom: 6px;
          }
          .subtitle {
            font-size: 14px;
            color: #E8BDD4;
            max-width: 700px;
          }
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            padding: 24px 32px;
            background: #F4EFEA;
            border-bottom: 1px solid #E8E2D7;
          }
          .stat-card {
            background: #FFFFFF;
            padding: 16px 20px;
            border-radius: 10px;
            border: 1px solid #E8E2D7;
          }
          .stat-label {
            font-size: 11px;
            font-weight: 600;
            color: #736B63;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .stat-value {
            font-size: 20px;
            font-weight: 700;
            color: #3C1322;
            margin-top: 4px;
          }
          .content-wrap {
            padding: 24px 32px 32px;
            overflow-x: auto;
          }
          .info-note {
            background: #FAF5EE;
            border-left: 4px solid #8B2D5C;
            padding: 12px 16px;
            border-radius: 0 8px 8px 0;
            font-size: 13px;
            color: #5A524C;
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
          }
          thead th {
            background: #F8F6F2;
            color: #3C1322;
            text-align: left;
            padding: 12px 14px;
            font-weight: 600;
            border-bottom: 2px solid #E8E2D7;
          }
          tbody tr {
            border-bottom: 1px solid #EFEAE3;
            transition: background-color 0.15s;
          }
          tbody tr:hover {
            background: #FAF7F2;
          }
          td {
            padding: 12px 14px;
            vertical-align: middle;
          }
          a {
            color: #3C1322;
            text-decoration: none;
            font-weight: 500;
            word-break: break-all;
          }
          a:hover {
            color: #8B2D5C;
            text-decoration: underline;
          }
          .badge-priority {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 700;
            background: #E8F5E9;
            color: #2E7D32;
          }
          .badge-priority.high {
            background: #FFF3E0;
            color: #E65100;
          }
          .badge-priority.primary {
            background: #FCE4EC;
            color: #C2185B;
          }
          .badge-freq {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 6px;
            font-size: 11px;
            background: #F0EAE1;
            color: #5A524C;
            text-transform: capitalize;
          }
          .date-text {
            color: #736B63;
            font-family: monospace;
            font-size: 12px;
          }
          .footer {
            padding: 20px 32px;
            border-top: 1px solid #E8E2D7;
            text-align: center;
            font-size: 12px;
            color: #736B63;
            background: #FAF7F2;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="brand-badge">toomakt • Confectionery Atelier Cairo</span>
            <h1>XML Search Engine Sitemap</h1>
            <p class="subtitle">
              This XML sitemap is dynamically generated to help search engines like Google, Bing, and Yandex index toomakt's handcrafted confectionery products, categories, and editorial collections.
            </p>
          </div>

          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-label">Total Indexable URLs</div>
              <div class="stat-value"><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Primary Market</div>
              <div class="stat-value">Egypt (27 Governorates)</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Supported Locales</div>
              <div class="stat-value">Arabic (ar_EG) &amp; English</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Canonical Host</div>
              <div class="stat-value">https://www.toomakt.com</div>
            </div>
          </div>

          <div class="content-wrap">
            <div class="info-note">
              <strong>Google Search Console Note:</strong> All URLs listed below return 200 OK, enforce canonical self-referencing headers, and exclude private admin, cart, and authentication endpoints.
            </div>

            <table>
              <thead>
                <tr>
                  <th style="width: 55%;">Page URL</th>
                  <th style="width: 15%;">Change Frequency</th>
                  <th style="width: 15%;">Priority</th>
                  <th style="width: 15%;">Last Modified</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:urlset/sitemap:url">
                  <tr>
                    <td>
                      <xsl:variable name="itemURL">
                        <xsl:value-of select="sitemap:loc"/>
                      </xsl:variable>
                      <a href="{$itemURL}">
                        <xsl:value-of select="sitemap:loc"/>
                      </a>
                    </td>
                    <td>
                      <span class="badge-freq">
                        <xsl:value-of select="sitemap:changefreq"/>
                      </span>
                    </td>
                    <td>
                      <xsl:choose>
                        <xsl:when test="sitemap:priority &gt;= 0.9">
                          <span class="badge-priority primary">
                            <xsl:value-of select="sitemap:priority"/>
                          </span>
                        </xsl:when>
                        <xsl:when test="sitemap:priority &gt;= 0.8">
                          <span class="badge-priority high">
                            <xsl:value-of select="sitemap:priority"/>
                          </span>
                        </xsl:when>
                        <xsl:otherwise>
                          <span class="badge-priority">
                            <xsl:value-of select="sitemap:priority"/>
                          </span>
                        </xsl:otherwise>
                      </xsl:choose>
                    </td>
                    <td>
                      <span class="date-text">
                        <xsl:value-of select="sitemap:lastmod"/>
                      </span>
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>

          <div class="footer">
            toomakt Confectionery Atelier • Cairo, Egypt • All Rights Reserved
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
