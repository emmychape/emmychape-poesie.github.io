<<<<<<< HEAD
document.addEventListener("DOMContentLoaded", () => {
  const archiveGrid = document.getElementById("archiveGrid");
  const modal = document.getElementById("modal");
  const modalSvgContainer = document.getElementById("modalSvgContainer");
  const closeModal = document.getElementById("closeModal");
  const exportModalBtn = document.getElementById("exportModalBtn");
  const deleteBtn = document.getElementById("deleteModeBtn");

  let deleteMode = false;
  let compositions = JSON.parse(localStorage.getItem("compositions") || "[]").sort(() => Math.random() - 0.5);

  if (!compositions.length) {
    archiveGrid.innerHTML = "<p style='text-align:center'>Aucune composition sauvegardée</p>";
    return;
  }

  compositions.forEach((comp, index) => {
    const div = document.createElement("div");
    div.className = "grid-item";

    // Create preview (PNG) for the grid
    const svgDoc = new DOMParser().parseFromString(comp.svg, "image/svg+xml").documentElement;
    const cloneSvg = svgDoc.cloneNode(true);

    // Ensure viewBox exists
    if (!cloneSvg.getAttribute("viewBox")) {
      const width = cloneSvg.getAttribute("width") || "1000";
      const height = cloneSvg.getAttribute("height") || "1000";
      cloneSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    }

    cloneSvg.setAttribute("width", "300");
    cloneSvg.setAttribute("height", "300");

    const serialized = new XMLSerializer().serializeToString(cloneSvg);
    const blob = new Blob([serialized], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 150;
      canvas.height = 150;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const preview = new Image();
      preview.src = canvas.toDataURL("image/png");
      preview.style.width = "100%";
      preview.style.height = "100%";
      div.appendChild(preview);
    };
    img.src = url;

    div.addEventListener("click", () => {
      if (deleteMode) {
        if (confirm("Supprimer cette composition ?")) {
          compositions.splice(index, 1);
          localStorage.setItem("compositions", JSON.stringify(compositions));
          location.reload();
        }
        return;
      }

      modalSvgContainer.innerHTML = comp.svg;

      const svgEl = modalSvgContainer.querySelector("svg");
      if (svgEl) {
        // Auto-add viewBox if missing
        if (!svgEl.getAttribute("viewBox")) {
          const width = svgEl.getAttribute("width") || "1000";
          const height = svgEl.getAttribute("height") || "1000";
          svgEl.setAttribute("viewBox", `0 0 ${width} ${height}`);
        }

        svgEl.removeAttribute("width");
        svgEl.removeAttribute("height");
        svgEl.setAttribute("preserveAspectRatio", "xMidYMid meet");

        svgEl.style.width = "100%";
        svgEl.style.height = "100%";
        svgEl.style.maxHeight = "100%";
        svgEl.style.maxWidth = "100%";
        svgEl.style.display = "block";
        svgEl.style.margin = "0 auto";
      }

      modal.classList.remove("hidden");

      exportModalBtn.onclick = () => {
        const blob = new Blob([comp.svg], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `composition-${index + 1}.svg`;
        link.click();
      };
    });

    archiveGrid.appendChild(div);
  });

  closeModal.onclick = () => {
    modal.classList.add("hidden");
    modalSvgContainer.innerHTML = "";
  };

  deleteBtn.onclick = () => {
    deleteMode = !deleteMode;
    document.body.classList.toggle("delete-mode", deleteMode);
  };
});
=======
document.addEventListener("DOMContentLoaded", () => {
  const archiveGrid = document.getElementById("archiveGrid");
  const modal = document.getElementById("modal");
  const modalSvgContainer = document.getElementById("modalSvgContainer");
  const closeModal = document.getElementById("closeModal");
  const exportModalBtn = document.getElementById("exportModalBtn");
  const deleteBtn = document.getElementById("deleteModeBtn");

  const confirmModal = document.getElementById("confirmDeleteModal");
  const confirmYes = document.getElementById("confirmDeleteYes");
  const confirmNo = document.getElementById("confirmDeleteNo");

  let deleteMode = false;
  let compositions = JSON.parse(localStorage.getItem("compositions") || "[]").sort(() => Math.random() - 0.5);
  let deleteIndex = null;

  if (!compositions.length) {
    archiveGrid.innerHTML = "<p style='text-align:center'>Aucune composition sauvegardée</p>";
    return;
  }

  compositions.forEach((comp, index) => {
    const div = document.createElement("div");
    div.className = "grid-item";

    // SVG to preview PNG
    const svgDoc = new DOMParser().parseFromString(comp.svg, "image/svg+xml").documentElement;
    const cloneSvg = svgDoc.cloneNode(true);

    if (!cloneSvg.getAttribute("viewBox")) {
      const width = cloneSvg.getAttribute("width") || "1000";
      const height = cloneSvg.getAttribute("height") || "1000";
      cloneSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    }

    cloneSvg.setAttribute("width", "300");
    cloneSvg.setAttribute("height", "300");

    const serialized = new XMLSerializer().serializeToString(cloneSvg);
    const blob = new Blob([serialized], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 150;
      canvas.height = 150;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const preview = new Image();
      preview.src = canvas.toDataURL("image/png");
      preview.className = "preview-img"; // pour style CSS
      div.appendChild(preview);

      // Icône poubelle
      const deleteIcon = document.createElement("button");
      deleteIcon.className = "delete-icon";
      deleteIcon.innerHTML = "🗑️";
      deleteIcon.title = "Supprimer cette composition";
      deleteIcon.onclick = (e) => {
        e.stopPropagation();
        deleteIndex = index;
        confirmModal.classList.remove("hidden");
      };
      div.appendChild(deleteIcon);
    };

    img.src = url;

    div.addEventListener("click", () => {
      if (deleteMode) return; // ne rien faire en mode multiple

      modalSvgContainer.innerHTML = comp.svg;

      const svgEl = modalSvgContainer.querySelector("svg");
      if (svgEl) {
        if (!svgEl.getAttribute("viewBox")) {
          const width = svgEl.getAttribute("width") || "1000";
          const height = svgEl.getAttribute("height") || "1000";
          svgEl.setAttribute("viewBox", `0 0 ${width} ${height}`);
        }

        svgEl.removeAttribute("width");
        svgEl.removeAttribute("height");
        svgEl.setAttribute("preserveAspectRatio", "xMidYMid meet");

        svgEl.style.width = "100%";
        svgEl.style.height = "100%";
        svgEl.style.display = "block";
        svgEl.style.margin = "0 auto";
      }

      modal.classList.remove("hidden");

      exportModalBtn.onclick = () => {
        const blob = new Blob([comp.svg], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `composition-${index + 1}.svg`;
        link.click();
      };
    });

    archiveGrid.appendChild(div);
  });

  closeModal.onclick = () => {
    modal.classList.add("hidden");
    modalSvgContainer.innerHTML = "";
  };

  deleteBtn.onclick = () => {
    deleteMode = !deleteMode;
    document.body.classList.toggle("delete-mode", deleteMode);
  };

  confirmYes.onclick = () => {
    if (deleteIndex !== null) {
      compositions.splice(deleteIndex, 1);
      localStorage.setItem("compositions", JSON.stringify(compositions));
      location.reload();
    }
  };

  confirmNo.onclick = () => {
    confirmModal.classList.add("hidden");
    deleteIndex = null;
  };
});
>>>>>>> 5a61b99e66031fba8bea070f5f13d28e1de81a0a
