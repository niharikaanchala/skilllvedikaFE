<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">

<html>
<head>
  <title>Sitemap</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
      background: #f9fafb;
    }
    h1 {
      font-size: 24px;
      margin-bottom: 20px;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      background: white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.05);
    }
    th, td {
      border: 1px solid #e5e7eb;
      padding: 10px;
      text-align: left;
    }
    th {
      background: #111827;
      color: white;
    }
    tr:nth-child(even) {
      background: #f3f4f6;
    }
    a {
      color: #2563eb;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>

<body>

<h1>Sitemap</h1>

<table>
  <tr>
    <th>URL</th>
    <th>Last Modified</th>
  </tr>

  <!-- ✅ Works with namespace -->
  <xsl:for-each select="//*[local-name()='url']">
    <tr>
      <td>
        <a href="{*[local-name()='loc']}">
          <xsl:value-of select="*[local-name()='loc']"/>
        </a>
      </td>
      <td>
        <xsl:value-of select="*[local-name()='lastmod']"/>
      </td>
    </tr>
  </xsl:for-each>

  <!-- ✅ Works for sitemap index -->
  <xsl:for-each select="//*[local-name()='sitemap']">
    <tr>
      <td>
        <a href="{*[local-name()='loc']}">
          <xsl:value-of select="*[local-name()='loc']"/>
        </a>
      </td>
      <td>
        <xsl:value-of select="*[local-name()='lastmod']"/>
      </td>
    </tr>
  </xsl:for-each>

</table>

</body>
</html>

</xsl:template>
</xsl:stylesheet>