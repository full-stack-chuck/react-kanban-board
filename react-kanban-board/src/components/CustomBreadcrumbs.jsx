import React from "react";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronRight } from "@mui/icons-material";

function CustomBreadcrumbs() {
  const location = useLocation();
  const navigate = useNavigate();

  const pathSegments = location.pathname.split("/").filter(Boolean);

  const isId = (segment) => {
    return /\d/.test(segment) || segment.length > 20;
  };

  const formatSegment = (segment) => {
    return segment
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const breadcrumbItems = pathSegments.reduce((items, segment, index) => {
    if (isId(segment)) return items;

    const path = `/${pathSegments.slice(0, index + 1).join("/")}`;

    items.push({
      label: formatSegment(segment),
      path,
    });

    return items;
  }, []);

  return (
    <Breadcrumbs
      separator={<ChevronRight sx={{ fontSize: 18 }} />}
      aria-label="breadcrumb"
      sx={{ mb: 3 }}
    >
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;

        return isLast ? (
          <Typography
            key={item.path}
            color="text.primary"
            sx={{ display: "flex", alignItems: "center" }}
          >
            {item.label}
          </Typography>
        ) : (
          <Link
            key={item.path}
            color="inherit"
            onClick={() => navigate(item.path)}
            sx={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              "&:hover": {
                textDecoration: "none",
                color: "primary.main",
              },
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}

export default CustomBreadcrumbs;
