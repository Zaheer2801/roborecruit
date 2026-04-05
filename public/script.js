// --- Navigation Scroll Effect & Mobile Menu ---
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
});

function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('active');
}

// --- Lenis Physics-Based Smooth Scroll Engine ---
const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 0.9,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// --- GSAP ScrollTrigger Core Cinematic Animations ---
gsap.registerPlugin(ScrollTrigger);

// Ensure CSS pre-loaded elements don't flash, then strip their frozen `.fade-up` CSS hooks.
document.querySelectorAll('.fade-up').forEach(el => {
  // Removing the old CSS transitions to let JS handle the physics perfectly
  el.classList.remove('fade-up');
  el.style.opacity = '1';
  el.style.transform = 'none';
  el.style.transition = 'none';
});

// 1. Text & Headers Gliding In
gsap.utils.toArray('.section-tag, .header-text h2, .header-text p').forEach(el => {
  gsap.fromTo(el, 
    { y: 50, opacity: 0 },
    { scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none reverse" },
      y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
  );
});

// 2. Dashboard Cards Staggering Fluidly
gsap.utils.toArray('.stat-cards, .pricing-cards, .steps-timeline, .stats-grid').forEach(container => {
  const cards = container.querySelectorAll('.glass-card, .price-card, .step, .stat-item');
  if(cards.length > 0) {
    gsap.fromTo(cards,
      { y: 60, opacity: 0, scale: 0.98 },
      { scrollTrigger: { 
          trigger: container, 
          start: "top 85%", 
          toggleActions: "play none none reverse",
          onEnter: () => {
             // Fire counters if they exist in this container
             cards.forEach(card => {
                const counter = card.querySelector('.counter');
                if (counter && !counter.classList.contains('counted')) {
                    animateCounter(counter);
                }
             });
          }
        },
        y: 0, opacity: 1, scale: 1, duration: 1.4, stagger: 0.15, ease: "power4.out" }
    );
  }
});

// 2.5 Horizontal Scroll-jacking Logic
const stepsContainer = document.querySelector('.steps-timeline');
const howItWorksSection = document.querySelector('.how-it-works-section');

if(window.innerWidth > 768 && stepsContainer && howItWorksSection) {
  // Pin the entire section and scroll the container horizontally
  gsap.to(stepsContainer, {
    x: () => -(stepsContainer.scrollWidth - document.documentElement.clientWidth) + "px",
    ease: "none",
    scrollTrigger: {
      trigger: howItWorksSection,
      pin: true,
      scrub: 1, // Smooth dragging effect
      end: () => "+=" + stepsContainer.offsetWidth // The scroll distance equals the width of the horizontal strip
    }
  });
}

// 3. Hero Sub-Elements specific timing
function playHeroAnimations() {
  gsap.fromTo('.hero-content .badge', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out" });
  gsap.fromTo('.hero-content h1', { y: 40, opacity: 0 }, { y: 0, opacity: 1, delay: 0.2, duration: 1.4, ease: "power3.out" });
  gsap.fromTo('.hero-content p', { y: 30, opacity: 0 }, { y: 0, opacity: 1, delay: 0.4, duration: 1.4, ease: "power3.out" });
  gsap.fromTo('.hero-stats .hero-stat', { opacity: 0, y: 20 }, { opacity: 1, y: 0, delay: 0.6, duration: 0.8, stagger: 0.15, ease: "power3.out" });
  gsap.fromTo('.hero-ctas', { opacity: 0, y: 20 }, { opacity: 1, y: 0, delay: 0.8, duration: 0.8, ease: "power3.out" });
  gsap.fromTo('.dispatch-panel', { x: 50, opacity: 0 }, { x: 0, opacity: 1, delay: 0.5, duration: 1.6, ease: "power4.out" });
}

// --- Counter Animation ---
function animateCounter(el) {
  el.classList.add('counted');
  const target = +el.getAttribute('data-target');
  const prefix = el.getAttribute('data-prefix') || '';
  const suffix = el.getAttribute('data-suffix') || '';
  const duration = 2000;
  const stepTime = 20;
  const steps = duration / stepTime;
  const increment = target / steps;
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      clearInterval(timer);
      current = target;
    }
    // Format with commas if >= 1000
    let displayVal = Math.floor(current).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    el.innerText = `${prefix}${displayVal}${suffix}`;
  }, stepTime);
}

// Trigger hero counters
setTimeout(() => {
  document.querySelectorAll('.hero-content .counter').forEach(animateCounter);
}, 500);

const stateAbbreviations = {
  "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR", "California": "CA",
  "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE", "Florida": "FL", "Georgia": "GA",
  "Hawaii": "HI", "Idaho": "ID", "Illinois": "IL", "Indiana": "IN", "Iowa": "IA",
  "Kansas": "KS", "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
  "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS", "Missouri": "MO",
  "Montana": "MT", "Nebraska": "NE", "Nevada": "NV", "New Hampshire": "NH", "New Jersey": "NJ",
  "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH",
  "Oklahoma": "OK", "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC",
  "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT", "Vermont": "VT",
  "Virginia": "VA", "Washington": "WA", "West Virginia": "WV", "Wisconsin": "WI", "Wyoming": "WY",
  "District of Columbia": "DC"
};

// --- D3 Network Map ---
const baseCities = [
  { name: "Phoenix", coords: [-112.0740, 33.4484] }, // Cardinals
  { name: "Atlanta", coords: [-84.3880, 33.7490] }, // Falcons
  { name: "Baltimore", coords: [-76.6122, 39.2904] }, // Ravens
  { name: "Buffalo", coords: [-78.8784, 42.8864] }, // Bills
  { name: "Charlotte", coords: [-80.8431, 35.2271] }, // Panthers
  { name: "Chicago", coords: [-87.6298, 41.8781] }, // Bears
  { name: "Cincinnati", coords: [-84.5120, 39.1031] }, // Bengals
  { name: "Cleveland", coords: [-81.6944, 41.4993] }, // Browns
  { name: "Dallas", coords: [-96.7970, 32.7767] }, // Cowboys
  { name: "Denver", coords: [-104.9903, 39.7392] }, // Broncos
  { name: "Detroit", coords: [-83.0458, 42.3314] }, // Lions
  { name: "Green Bay", coords: [-88.0198, 44.5133] }, // Packers
  { name: "Houston", coords: [-95.3698, 29.7604] }, // Texans
  { name: "Indianapolis", coords: [-86.1581, 39.7684] }, // Colts
  { name: "Jacksonville", coords: [-81.6557, 30.3322] }, // Jaguars
  { name: "Kansas City", coords: [-94.5786, 39.0997] }, // Chiefs
  { name: "Las Vegas", coords: [-115.1398, 36.1699] }, // Raiders
  { name: "Los Angeles", coords: [-118.2437, 34.0522] }, // Rams & Chargers
  { name: "Miami", coords: [-80.1918, 25.7617] }, // Dolphins
  { name: "Minneapolis", coords: [-93.2650, 44.9778] }, // Vikings
  { name: "Boston", coords: [-71.0589, 42.3601] }, // Patriots
  { name: "New Orleans", coords: [-90.0715, 29.9511] }, // Saints
  { name: "New York", coords: [-74.0060, 40.7128] }, // Giants & Jets
  { name: "Philadelphia", coords: [-75.1652, 39.9526] }, // Eagles
  { name: "Pittsburgh", coords: [-79.9959, 40.4406] }, // Steelers
  { name: "San Francisco", coords: [-122.4194, 37.7749] }, // 49ers
  { name: "Seattle", coords: [-122.3321, 47.6062] }, // Seahawks
  { name: "Tampa", coords: [-82.4572, 27.9506] }, // Buccaneers
  { name: "Nashville", coords: [-86.7816, 36.1627] }, // Titans
  { name: "Washington DC", coords: [-77.0369, 38.9072] } // Commanders
];

// Pre-compute ready drivers
const cities = baseCities.map(c => ({
  ...c,
  driversReady: Math.floor(45 + Math.random() * 135)
}));

function drawMap() {
  const container = document.getElementById("d3-map-container");
  if (!container) return;
  const width = container.clientWidth;
  const height = container.clientHeight || 520;

  // Clear previous drawing if window resized
  d3.select("#d3-map-container").selectAll("*").remove();
  d3.selectAll(".map-tooltip").remove();

  const svg = d3.select("#d3-map-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // Define glowing filter
  const defs = svg.append("defs");
  const filter = defs.append("filter").attr("id", "glow");
  filter.append("feGaussianBlur").attr("stdDeviation", "3").attr("result", "coloredBlur");
  const feMerge = filter.append("feMerge");
  feMerge.append("feMergeNode").attr("in", "coloredBlur");
  feMerge.append("feMergeNode").attr("in", "SourceGraphic");

  // Load remote topography JSON for USA
  d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json").then((us) => {
    
    // Tooltip
    const tooltip = d3.select("body").append("div")
      .attr("class", "map-tooltip")
      .style("position", "absolute")
      .style("background", "rgba(7, 17, 29, 0.95)")
      .style("padding", "10px 14px")
      .style("border", "1px solid rgba(102,0,153,0.5)")
      .style("border-radius", "8px")
      .style("color", "#fff")
      .style("font-size", "13px")
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("box-shadow", "0 4px 20px rgba(0,0,0,0.5)")
      .style("transition", "opacity 0.2s");

    // Create feature to fit the projection
    const usGeoJson = topojson.feature(us, us.objects.states);
    
    const projection = d3.geoAlbersUsa().fitSize([width, height], usGeoJson);
    const path = d3.geoPath().projection(projection);

    // Draw Map Glow Base (Thick blurred stroke underneath map)
    svg.append("g")
      .selectAll("path")
      .data(usGeoJson.features)
      .enter().append("path")
      .attr("d", path)
      .attr("fill", "none")
      .attr("stroke", "rgba(102,0,153,0.8)")
      .attr("stroke-width", 2)
      .attr("filter", "url(#glow)");

    // Draw Map Top Layer
    svg.append("g")
      .selectAll("path")
      .data(usGeoJson.features)
      .enter().append("path")
      .attr("d", path)
      .attr("fill", "#0D1F35") // Background alt color
      .attr("stroke", "rgba(153,51,204,0.3)") // Card border color
      .attr("stroke-width", 1);

    // Add State Abbreviations
    svg.append("g")
      .attr("class", "state-labels")
      .selectAll("text")
      .data(usGeoJson.features)
      .enter().append("text")
      .text(d => d.properties && stateAbbreviations[d.properties.name] ? stateAbbreviations[d.properties.name] : "")
      .attr("x", d => {
        const c = path.centroid(d);
        return c && !isNaN(c[0]) ? c[0] : -1000;
      })
      .attr("y", d => {
        const c = path.centroid(d);
        return c && !isNaN(c[1]) ? c[1] : -1000;
      })
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("fill", "rgba(255, 255, 255, 0.15)")
      .style("font-size", "11px")
      .style("font-family", "Outfit, sans-serif")
      .style("font-weight", "600")
      .style("pointer-events", "none")
      .style("letter-spacing", "1px");

    // Filter out cities not in projection
    const projectedCities = cities.map(c => {
      const p = projection(c.coords);
      return { ...c, p };
    }).filter(c => c.p);

    // Draw routes: Nearest neighbors to ensure routes stay overland, avoiding sea-ways
    const routes = [];
    projectedCities.forEach(city => {
      const neighbors = projectedCities
        .filter(c => c !== city)
        .map(c => ({ city: c, dist: Math.pow(c.p[0] - city.p[0], 2) + Math.pow(c.p[1] - city.p[1], 2) }))
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 3); // Increased to 3 nearest neighbors to generate a rich, interconnected highway map
      
      neighbors.forEach(n => {
        // Prevent duplicate undirected edges
        const exists = routes.some(r => (r.start === city && r.end === n.city) || (r.start === n.city && r.end === city));
        if(!exists && n.dist < 600000) { // Increased range to allow longer trucking routes
          routes.push({ start: city, end: n.city });
        }
      });
    });

    routes.forEach(route => {
      // Draw straight 'real road' path
      const pathElem = svg.append("path")
        .attr("d", `M${route.start.p[0]},${route.start.p[1]} L${route.end.p[0]},${route.end.p[1]}`)
        .attr("fill", "none")
        .attr("stroke", "rgba(255,102,0, 0.25)") // Bright Orange highway color
        .attr("stroke-width", 2.0)
        .attr("stroke-dasharray", "5, 5") // Structured highway dashed lanes
        .node();

      // Animate Trucks (Paths on the route)
      const truckGroup = svg.append("g")
        .style("cursor", "pointer");

      const truck = truckGroup.append("path")
        .attr("d", "M4,-2.5 L6,-2.5 C6.5,-2.5 7,-2 7,-1.5 L7,1.5 C7,2 6.5,2.5 6,2.5 L4,2.5 Z M-6,-3 L3,-3 L3,3 L-6,3 Z")
        .attr("fill", "#FF6600") // CTA Orange
        .attr("filter", "url(#glow)");

      // Headlights initially invisible
      const headlight1 = truckGroup.append("circle")
        .attr("cx", 7.5).attr("cy", -1.5).attr("r", 1.5).attr("fill", "#FFF").attr("opacity", 0)
        .attr("filter", "url(#glow)").style("pointer-events", "none");
      const headlight2 = truckGroup.append("circle")
        .attr("cx", 7.5).attr("cy", 1.5).attr("r", 1.5).attr("fill", "#FFF").attr("opacity", 0)
        .attr("filter", "url(#glow)").style("pointer-events", "none");

      // Hover overlay to make grabbing easier
      truckGroup.append("rect")
        .attr("x", -10).attr("y", -6).attr("width", 20).attr("height", 12)
        .attr("fill", "transparent");

      truckGroup.on("mouseover", function(event) {
        headlight1.attr("opacity", 1);
        headlight2.attr("opacity", 1);
        tooltip.style("opacity", 1);
        tooltip.html(`Moving from <strong style="color:var(--cta-orange);">${route.start.name}</strong><br>to <strong style="color:var(--cta-orange);">${route.end.name}</strong>`)
          .style("left", (event.pageX + 15) + "px")
          .style("top", (event.pageY - 35) + "px");
      })
      .on("mousemove", function(event) {
        tooltip.style("left", (event.pageX + 15) + "px")
               .style("top", (event.pageY - 35) + "px");
      })
      .on("mouseout", function() {
        headlight1.attr("opacity", 0);
        headlight2.attr("opacity", 0);
        tooltip.style("opacity", 0);
      });

      const duration = 3000 + Math.random() * 3000;
      let currentProgress = Math.random(); // Start offset
      let isPaused = false;
      const length = pathElem.getTotalLength();

      function animateSegment() {
        if (isPaused) return;
        const remDuration = duration * (1 - currentProgress); // time remaining

        truckGroup.transition()
          .duration(remDuration)
          .ease(d3.easeLinear)
          .attrTween("transform", function() {
            return function(t) {
              const actualT = currentProgress + t * (1 - currentProgress);
              truckGroup.node().__currentT = actualT;
              
              const p = pathElem.getPointAtLength(actualT * length);
              const pNext = pathElem.getPointAtLength(Math.min(actualT * length + 1, length));
              let angle = Math.atan2(pNext.y - p.y, pNext.x - p.x) * 180 / Math.PI;
              if (actualT >= 1) {
                const pPrev = pathElem.getPointAtLength(Math.max(length - 1, 0));
                angle = Math.atan2(p.y - pPrev.y, p.x - pPrev.x) * 180 / Math.PI;
              }
              return `translate(${p.x},${p.y}) rotate(${angle})`;
            }
          })
          .on("end", function() {
            if (!isPaused) {
              currentProgress = 0;
              animateSegment();
            }
          });
      }
      
      animateSegment();

      truckGroup.on("click", function(event) {
        if (isPaused) return;
        isPaused = true;
        truckGroup.interrupt();
        if (truckGroup.node().__currentT !== undefined) {
          currentProgress = truckGroup.node().__currentT;
        }
        
        // Visual indicator - flash red headlights to indicate "stopped"
        headlight1.attr("fill", "#FF0000").attr("r", 2).attr("opacity", 1);
        headlight2.attr("fill", "#FF0000").attr("r", 2).attr("opacity", 1);
        tooltip.style("opacity", 1);
        tooltip.html(`<span style="color:#FF0000; font-weight:bold;">STANDBY PAUSE</span><br>Route: <strong style="color:var(--cta-orange);">${route.start.name}</strong> to <strong style="color:var(--cta-orange);">${route.end.name}</strong>`)
          .style("left", (event.pageX + 15) + "px")
          .style("top", (event.pageY - 35) + "px");

        setTimeout(() => {
          headlight1.attr("fill", "#FFF").attr("r", 1.5).attr("opacity", 0);
          headlight2.attr("fill", "#FFF").attr("r", 1.5).attr("opacity", 0);
          tooltip.style("opacity", 0);
          isPaused = false;
          if (currentProgress >= 1) currentProgress = 0; // jump back if reached end during pause frame
          animateSegment();
        }, 2000);
      });
    });

    // Draw Pulse Rings (outer circles)
    const rings = svg.selectAll(".ring")
      .data(projectedCities)
      .enter().append("circle")
      .attr("class", "ring")
      .attr("cx", d => d.p[0])
      .attr("cy", d => d.p[1])
      .attr("r", 6)
      .attr("fill", "none")
      .attr("stroke", "#9933CC")
      .attr("stroke-width", 2)
      .attr("opacity", 0.6)
      .attr("filter", "url(#glow)");

    // Draw Inner Nodes
    const nodes = svg.selectAll(".node")
      .data(projectedCities)
      .enter().append("circle")
      .attr("class", "node")
      .attr("cx", d => d.p[0])
      .attr("cy", d => d.p[1])
      .attr("r", 4)
      .attr("fill", "#9933CC")
      .attr("filter", "url(#glow)")
      .style("cursor", "pointer");

    // Cinematic Pulse Animation on the outer rings
    function pulseRings() {
      rings.attr("r", 6)
        .attr("opacity", 0.4)
        .transition()
        .duration(2500)
        .ease(d3.easeCubicOut)
        .attr("r", 14)
        .attr("opacity", 0)
        .on("end", pulseRings);
    }
    // Stagger start times slightly for biological feel
    rings.each(function(d, i) {
      d3.select(this)
        .transition()
        .delay(Math.random() * 2000)
        .on("end", function() {
          d3.select(this)
            .transition()
            .duration(2500)
            .ease(d3.easeCubicOut)
            .attr("r", 14)
            .attr("opacity", 0)
            .on("end", pulseRings);
        });
    });

    // Node Tooltip initialized above (used for both trucks and nodes)

    nodes.on("mouseover", function(event, d) {
      d3.select(this).attr("r", 7).attr("fill", "#FFFFFF");
      tooltip.style("opacity", 1);
      tooltip.html(`<strong style="color:#9933CC;">${d.name}</strong><br>${d.driversReady} drivers ready`)
        .style("left", (event.pageX + 15) + "px")
        .style("top", (event.pageY - 35) + "px");
    })
    .on("mousemove", function(event) {
      tooltip.style("left", (event.pageX + 15) + "px")
             .style("top", (event.pageY - 35) + "px");
    })
    .on("mouseout", function() {
      d3.select(this).attr("r", 4).attr("fill", "#9933CC");
      tooltip.style("opacity", 0);
    });

  });
}

// Map observer setup
const mapObserver = new IntersectionObserver((entries) => {
  if(entries[0].isIntersecting) {
    drawMap();
    mapObserver.unobserve(entries[0].target);
  }
});

// Use timeout in case element rendering doesn't catch immediately
setTimeout(() => {
  const mapContainer = document.getElementById("network");
  if(mapContainer) mapObserver.observe(mapContainer);
}, 100);

// Redraw on resize (debounce for perf)
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if(document.getElementById("d3-map-container") && document.getElementById("d3-map-container").children.length > 0) {
      drawMap();
    }
  }, 250);
});

// --- API Fetcher & Data Constructor ---
function loadDrivers() {
  d3.csv('roborecruit_drivers_1000.csv')
    .then(rawData => {
      if(!rawData || rawData.length === 0) return;
      
      // Netlify Fix: Parse static CSV strings into native JS numeric types structurally mimicking the old API
      const data = rawData.map(d => ({
        ...d,
        on_time_percentage: parseFloat(d.on_time_percentage),
        total_deployments: parseInt(d.total_deployments, 10),
        rating: parseFloat(d.rating)
      }));

          // 1. CLEARED subset
          const clearedDrivers = data.filter(d => d.status && d.status.toUpperCase() === 'CLEARED');

          // 2. Map Tooltips (Modify global cities bound object instances)
          cities.forEach(cityNode => {
              const count = clearedDrivers.filter(d => d.city === cityNode.name).length;
              cityNode.driversReady = count;
          });

          // 3. STATS BAND variables
          // Simulate the true production size (10,000+) while iterating over the leaner 1000-row training CSV
          const totalDrivers = data.length >= 1000 ? 10000 : data.length;
          const driversWithOnTime = data.filter(d => typeof d.on_time_percentage === 'number');
          const sumOnTime = driversWithOnTime.reduce((sum, current) => sum + current.on_time_percentage, 0);
          const avgOnTime = driversWithOnTime.length > 0 ? Math.round(sumOnTime / driversWithOnTime.length) : 0;

          if(document.getElementById('stat-total-drivers')) {
            document.getElementById('stat-total-drivers').innerText = totalDrivers.toLocaleString() + '+';
          }
          if(document.getElementById('stat-on-time')) {
            document.getElementById('stat-on-time').innerText = avgOnTime + '%';
          }
          if(document.getElementById('hero-pool-count')) {
            document.getElementById('hero-pool-count').innerText = totalDrivers.toLocaleString() + '+';
          }

          // 4. Live Ticker Badge
          const recentlyDeployed = clearedDrivers.filter(d => typeof d.total_deployments === 'number' && d.total_deployments > 0).length;
          if(document.getElementById('live-ticker')) {
            document.getElementById('live-ticker').innerText = `● ${recentlyDeployed.toLocaleString()} drivers deployed this week`;
          }

          // 5. HERO PANEL: random 3 cards
          if(clearedDrivers.length >= 3) {
             const shuffled = [...clearedDrivers].sort(() => 0.5 - Math.random());
             const top3 = shuffled.slice(0, 3);
             
             let cardsHTML = '';
             top3.forEach((d, index) => {
                const avatar = `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 50) + 1}`;
                cardsHTML += `
                 <div class="driver-card">
                   <div class="driver-info">
                     <img src="${avatar}" alt="${d.full_name}" class="avatar">
                     <div>
                       <div class="driver-name">${d.full_name}</div>
                       <div class="driver-details">${d.cdl_type} · ${d.city}, ${d.state} | ⭐ ${d.rating.toFixed(1)}</div>
                     </div>
                   </div>
                   <div class="status-badge ${index === 0 ? 'cleared' : index === 1 ? 'matching' : 'standby'}">${index === 0 ? 'CLEARED' : index === 1 ? 'MATCHING' : 'STANDBY'}</div>
                 </div>
                `;
             });
             const container = document.getElementById('hero-drivers-container');
             if(container) container.innerHTML = cardsHTML;
          }
    })
    .catch(err => console.error("API Error - could not load driver data:", err));
}
document.addEventListener('DOMContentLoaded', loadDrivers);


// --- SPLASH SCREEN LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
  const splashPlayed = sessionStorage.getItem('splashPlayed');
  const splashScreen = document.getElementById('splash-screen');
  const mainWrap = document.getElementById('main-content-wrap');
  
  if (splashPlayed || !splashScreen) {
    if(splashScreen) splashScreen.remove();
    if(mainWrap) mainWrap.style.opacity = 1;
    if(typeof playHeroAnimations === 'function') playHeroAnimations();
    return;
  }

  // Splash sequence active
  document.body.classList.add('splash-active');
  mainWrap.style.opacity = 0;
  mainWrap.style.transition = 'opacity 600ms ease-out';

  const logo = document.getElementById('splash-logo');
  const line = document.getElementById('splash-line');
  const topPanel = document.querySelector('.splash-top');
  const botPanel = document.querySelector('.splash-bottom');

  // Step 2: 300ms
  setTimeout(() => {
    logo.style.opacity = 1;
    logo.style.transform = 'scale(1)';
  }, 300);

  // Step 3: 900ms
  setTimeout(() => {
    line.style.width = '100vw';
  }, 900);

  // Step 4: 1400ms
  setTimeout(() => {
    logo.style.opacity = 0;
    line.style.opacity = 0;
  }, 1400);

  // Step 5: 1600ms (curtain split)
  setTimeout(() => {
    topPanel.style.transform = 'translateY(-100vh)';
    botPanel.style.transform = 'translateY(100vh)';
  }, 1600);

  // Step 6: 2200ms (fade in site)
  setTimeout(() => {
    mainWrap.style.opacity = 1;
  }, 2200);

  // Step 7: 2800ms (remove splash & play hero)
  setTimeout(() => {
    splashScreen.remove();
    document.body.classList.remove('splash-active');
    sessionStorage.setItem('splashPlayed', 'true');
    if(typeof playHeroAnimations === 'function') playHeroAnimations();
  }, 2800);
});
