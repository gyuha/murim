import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import { Compass, Crosshair, Minus, Plus } from 'lucide-react';
import countriesAtlasUrl from '../assets/data/countries-50m.json?url';
import chinaProvincesUrl from '../assets/data/china-provinces.json?url';
import sumieUnderlayUrl from '../assets/images/sumie-underlay.jpg';
import { FACTION_META, LABEL_OFFSETS } from '../data/murimData';
import type { MapStyle, MurimLocation, RouteState } from '../types/murim';

export interface MurimMapHandle {
  focusLocation: (loc: MurimLocation) => void;
}

interface MurimMapProps {
  allLocations: MurimLocation[];
  filteredLocations: MurimLocation[];
  selectedId: string;
  route: RouteState;
  mapStyle: MapStyle;
  addPinMode: boolean;
  onSelectLocation: (id: string) => void;
  onPickPinCoords: (coords: [number, number]) => void;
  onCancelPinMode: () => void;
}

type WorldTopology = Topology<{
  countries: GeometryCollection;
}>;

export const MurimMap = forwardRef<MurimMapHandle, MurimMapProps>(
  function MurimMap(
    {
      allLocations,
      filteredLocations,
      selectedId,
      route,
      mapStyle,
      addPinMode,
      onSelectLocation,
      onPickPinCoords,
      onCancelPinMode,
    },
    ref,
  ) {
    const containerRef = useRef<HTMLElement | null>(null);
    const svgRef = useRef<SVGSVGElement | null>(null);

    const [atlasStatus, setAtlasStatus] = useState<'loading' | 'ready' | 'error'>('loading');
    const [coordText, setCoordText] = useState('108.00°E, 34.00°N');

    const worldDataRef = useRef<WorldTopology | null>(null);
    const provinceDataRef = useRef<GeoJSON.FeatureCollection | null>(null);
    const projectionRef = useRef<d3.GeoProjection | null>(null);
    const pathGeneratorRef = useRef<d3.GeoPath | null>(null);
    const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

    const layersRef = useRef<{
      mapGroup: d3.Selection<SVGGElement, unknown, null, undefined>;
      inkBgLayer: d3.Selection<SVGGElement, unknown, null, undefined>;
      graticuleLayer: d3.Selection<SVGGElement, unknown, null, undefined>;
      landLayer: d3.Selection<SVGGElement, unknown, null, undefined>;
      provinceLayer: d3.Selection<SVGGElement, unknown, null, undefined>;
      routeLayer: d3.Selection<SVGGElement, unknown, null, undefined>;
      markerLayer: d3.Selection<SVGGElement, unknown, null, undefined>;
    } | null>(null);

    // Keep latest props accessible to D3 event handlers without re-initializing SVG
    const latestPropsRef = useRef({
      selectedId,
      addPinMode,
      mapStyle,
      onSelectLocation,
      onPickPinCoords,
    });
    latestPropsRef.current = {
      selectedId,
      addPinMode,
      mapStyle,
      onSelectLocation,
      onPickPinCoords,
    };

    const drawWorldCountries = useCallback((topo: WorldTopology) => {
      const layers = layersRef.current;
      const pathGenerator = pathGeneratorRef.current;
      if (!layers || !pathGenerator) return;

      const countries = topojson.feature(topo, topo.objects.countries).features;
      layers.landLayer
        .selectAll<SVGPathElement, GeoJSON.Feature>('path')
        .data(countries)
        .join('path')
        .attr('class', (d) =>
          String(d.id) === '156' ? 'country-land country-china' : 'country-land',
        )
        .attr('d', (d) => pathGenerator(d) ?? '');
    }, []);

    const drawChinaProvinces = useCallback((provinces: GeoJSON.FeatureCollection) => {
      const layers = layersRef.current;
      const pathGenerator = pathGeneratorRef.current;
      if (!layers || !pathGenerator) return;

      layers.provinceLayer
        .selectAll<SVGPathElement, GeoJSON.Feature>('path')
        .data(provinces.features)
        .join('path')
        .attr('class', 'province-border')
        .attr('d', (d) => pathGenerator(d) ?? '');
    }, []);

    const renderMapData = useCallback(() => {
      const svgEl = svgRef.current;
      const layers = layersRef.current;
      const projection = projectionRef.current;
      const pathGenerator = pathGeneratorRef.current;
      if (!svgEl || !layers || !projection || !pathGenerator) return;

      const k = d3.zoomTransform(svgEl).k || 1;
      const isSumie = mapStyle === 'sumie';

      layers.inkBgLayer
        .select('.ink-underlay')
        .style('display', isSumie ? 'block' : 'none');

      // Render Route Arc
      layers.routeLayer.selectAll('*').remove();
      const fromLoc = allLocations.find((l) => l.id === route.fromId);
      const toLoc = allLocations.find((l) => l.id === route.toId);
      if (fromLoc && toLoc && fromLoc.id !== toLoc.id) {
        const interp = d3.geoInterpolate(fromLoc.coords, toLoc.coords);
        const pts = d3.range(0, 1.02, 0.04).map((t) => interp(Math.min(1, t)));
        const lineGeo: GeoJSON.LineString = { type: 'LineString', coordinates: pts };
        layers.routeLayer
          .append('path')
          .datum(lineGeo)
          .attr('class', 'route-arc')
          .attr('d', (d) => pathGenerator(d) ?? '')
          .style('stroke-width', `${2.6 / Math.sqrt(k)}px`);
      }

      // Render Markers
      const groups = layers.markerLayer
        .selectAll<SVGGElement, MurimLocation>('.marker-group')
        .data(filteredLocations, (d) => d.id)
        .join((enter) => {
          const g = enter.append('g').attr('class', 'marker-group');
          g.append('circle')
            .attr('class', 'marker-ring')
            .attr('fill', 'none')
            .attr('stroke-width', 1.8);
          g.append('circle')
            .attr('class', 'marker-dot')
            .attr('stroke', '#ffffff')
            .attr('stroke-width', 1.5);
          g.append('rect')
            .attr('class', 'marker-seal')
            .attr('rx', 1.5)
            .attr('stroke', '#f7f3e8')
            .attr('stroke-width', 1.2);
          g.append('text')
            .attr('class', 'marker-label')
            .attr('text-anchor', 'middle');
          return g;
        });

      groups.attr('transform', (d) => {
        const projected = projection(d.coords);
        if (!projected) return 'translate(0,0)';
        return `translate(${projected[0]}, ${projected[1]})`;
      });

      groups
        .select<SVGCircleElement>('.marker-ring')
        .attr('r', 12 / Math.sqrt(k))
        .attr('stroke', (d) => FACTION_META[d.faction]?.color || '#a62b21')
        .attr('opacity', (d) => (d.id === selectedId ? 0.85 : 0));

      groups
        .select<SVGCircleElement>('.marker-dot')
        .style('display', isSumie ? 'none' : 'block')
        .attr('r', (d) => (d.id === selectedId ? 7.5 : 5.2) / Math.sqrt(k))
        .attr('fill', (d) => FACTION_META[d.faction]?.color || '#a62b21');

      groups
        .select<SVGRectElement>('.marker-seal')
        .style('display', isSumie ? 'block' : 'none')
        .attr('x', (d) => -((d.id === selectedId ? 7.5 : 5.5) / Math.sqrt(k)))
        .attr('y', (d) => -((d.id === selectedId ? 7.5 : 5.5) / Math.sqrt(k)))
        .attr('width', (d) => (d.id === selectedId ? 15 : 11) / Math.sqrt(k))
        .attr('height', (d) => (d.id === selectedId ? 15 : 11) / Math.sqrt(k))
        .attr('fill', (d) =>
          d.id === selectedId
            ? '#a62b21'
            : FACTION_META[d.faction]?.color || '#a62b21',
        );

      groups
        .select<SVGTextElement>('.marker-label')
        .text((d) => d.name)
        .attr('fill', 'var(--text-main)')
        .style('font-size', `${Math.max(9.5, 11.5 / Math.pow(k, 0.45))}px`)
        .attr('dx', (d) => `${(LABEL_OFFSETS[d.id]?.[0] || 0) / Math.sqrt(k)}px`)
        .attr('dy', (d) => `${(LABEL_OFFSETS[d.id]?.[1] ?? -10) / Math.sqrt(k)}px`);

      groups.on('click', (event: MouseEvent, d) => {
        event.stopPropagation();
        if (latestPropsRef.current.addPinMode) return;
        latestPropsRef.current.onSelectLocation(d.id);
      });
    }, [allLocations, filteredLocations, mapStyle, route.fromId, route.toId, selectedId]);

    const renderMapDataRef = useRef(renderMapData);
    renderMapDataRef.current = renderMapData;

    const initMapCanvas = useCallback(() => {
      const container = containerRef.current;
      const svgEl = svgRef.current;
      if (!container || !svgEl) return;

      const width = container.clientWidth || 800;
      const height = container.clientHeight || 600;

      const svg = d3.select(svgEl).attr('viewBox', `0 0 ${width} ${height}`);
      svg.selectAll('*').remove();

      const projection = d3
        .geoMercator()
        .center([106.5, 34.5])
        .scale(Math.min(width, height) * 1.12)
        .translate([width / 2, height / 2]);

      const pathGenerator = d3.geoPath().projection(projection);
      projectionRef.current = projection;
      pathGeneratorRef.current = pathGenerator;

      const defs = svg.append('defs');
      const brushFilter = defs
        .append('filter')
        .attr('id', 'ink-brush')
        .attr('x', '-5%')
        .attr('y', '-5%')
        .attr('width', '110%')
        .attr('height', '110%');
      brushFilter
        .append('feTurbulence')
        .attr('type', 'fractalNoise')
        .attr('baseFrequency', '0.035')
        .attr('numOctaves', '3')
        .attr('result', 'noise');
      brushFilter
        .append('feDisplacementMap')
        .attr('in', 'SourceGraphic')
        .attr('in2', 'noise')
        .attr('scale', '2.4')
        .attr('xChannelSelector', 'R')
        .attr('yChannelSelector', 'G');

      const mapGroup = svg.append('g').attr('class', 'map-root');
      const inkBgLayer = mapGroup.append('g').attr('class', 'ink-bg-layer');
      const graticuleLayer = mapGroup.append('g');
      const landLayer = mapGroup.append('g');
      const provinceLayer = mapGroup.append('g').attr('class', 'province-layer');
      const routeLayer = mapGroup.append('g');
      const markerLayer = mapGroup.append('g');

      layersRef.current = {
        mapGroup,
        inkBgLayer,
        graticuleLayer,
        landLayer,
        provinceLayer,
        routeLayer,
        markerLayer,
      };

      const nw = projection([69.5, 56]) ?? [0, 0];
      const se = projection([138.41507, 16]) ?? [width, height];
      inkBgLayer
        .append('image')
        .attr('class', 'ink-underlay')
        .attr('href', sumieUnderlayUrl)
        .attr('x', nw[0])
        .attr('y', nw[1])
        .attr('width', Math.max(10, se[0] - nw[0]))
        .attr('height', Math.max(10, se[1] - nw[1]))
        .attr('preserveAspectRatio', 'none')
        .style('display', latestPropsRef.current.mapStyle === 'sumie' ? 'block' : 'none');

      graticuleLayer
        .append('path')
        .datum(d3.geoGraticule().step([5, 5])())
        .attr('class', 'graticule')
        .attr('d', (d) => pathGenerator(d) ?? '');

      const zoomBehavior = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.65, 8])
        .on('start', () => container.classList.add('is-interacting'))
        .on('end', () => container.classList.remove('is-interacting'))
        .on('zoom', (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
          mapGroup.attr('transform', event.transform.toString());
          const k = event.transform.k;
          const curSelectedId = latestPropsRef.current.selectedId;

          markerLayer
            .selectAll<SVGCircleElement, MurimLocation>('.marker-dot')
            .attr('r', (d) => (d.id === curSelectedId ? 7.5 : 5.2) / Math.sqrt(k));
          markerLayer
            .selectAll<SVGCircleElement, MurimLocation>('.marker-ring')
            .attr('r', 12 / Math.sqrt(k));
          markerLayer
            .selectAll<SVGRectElement, MurimLocation>('.marker-seal')
            .attr('x', (d) => -((d.id === curSelectedId ? 7.5 : 5.5) / Math.sqrt(k)))
            .attr('y', (d) => -((d.id === curSelectedId ? 7.5 : 5.5) / Math.sqrt(k)))
            .attr('width', (d) => (d.id === curSelectedId ? 15 : 11) / Math.sqrt(k))
            .attr('height', (d) => (d.id === curSelectedId ? 15 : 11) / Math.sqrt(k));
          markerLayer
            .selectAll<SVGTextElement, MurimLocation>('.marker-label')
            .style('font-size', `${Math.max(9.5, 11.5 / Math.pow(k, 0.45))}px`)
            .attr('dx', (d) => `${(LABEL_OFFSETS[d.id]?.[0] || 0) / Math.sqrt(k)}px`)
            .attr('dy', (d) => `${(LABEL_OFFSETS[d.id]?.[1] ?? -10) / Math.sqrt(k)}px`);
          routeLayer
            .selectAll('.route-arc')
            .style('stroke-width', `${2.6 / Math.sqrt(k)}px`);
        });

      zoomBehaviorRef.current = zoomBehavior;
      svg.call(zoomBehavior);

      svg.on('mousemove', (event: MouseEvent) => {
        const transform = d3.zoomTransform(svgEl);
        const [mx, my] = transform.invert(d3.pointer(event));
        const geo = projection.invert?.([mx, my]);
        if (geo && !Number.isNaN(geo[0]) && !Number.isNaN(geo[1])) {
          setCoordText(`${geo[0].toFixed(2)}°E, ${geo[1].toFixed(2)}°N`);
        }
      });

      svg.on('click', (event: MouseEvent) => {
        if (!latestPropsRef.current.addPinMode) return;
        const transform = d3.zoomTransform(svgEl);
        const [mx, my] = transform.invert(d3.pointer(event));
        const geo = projection.invert?.([mx, my]);
        if (geo && !Number.isNaN(geo[0]) && !Number.isNaN(geo[1])) {
          latestPropsRef.current.onPickPinCoords([
            Number(geo[0].toFixed(4)),
            Number(geo[1].toFixed(4)),
          ]);
        }
      });

      if (worldDataRef.current) {
        drawWorldCountries(worldDataRef.current);
      }
      if (provinceDataRef.current) {
        drawChinaProvinces(provinceDataRef.current);
      }
      renderMapDataRef.current();
    }, [drawChinaProvinces, drawWorldCountries]);

    const loadAtlas = useCallback(async () => {
      setAtlasStatus('loading');
      try {
        const [topo, provinces] = await Promise.all([
          d3.json<WorldTopology>(countriesAtlasUrl),
          d3.json<GeoJSON.FeatureCollection>(chinaProvincesUrl).catch(() => null),
        ]);
        if (!topo) throw new Error('Empty topology');
        worldDataRef.current = topo;
        drawWorldCountries(topo);
        if (provinces) {
          provinceDataRef.current = provinces;
          drawChinaProvinces(provinces);
        }
        renderMapDataRef.current();
        setAtlasStatus('ready');
      } catch {
        setAtlasStatus('error');
      }
    }, [drawChinaProvinces, drawWorldCountries]);

    useEffect(() => {
      initMapCanvas();
      loadAtlas();

      let resizeTimer: ReturnType<typeof setTimeout> | undefined;
      const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          initMapCanvas();
        }, 200);
      };
      window.addEventListener('resize', handleResize);
      return () => {
        clearTimeout(resizeTimer);
        window.removeEventListener('resize', handleResize);
      };
    }, [initMapCanvas, loadAtlas]);

    useEffect(() => {
      renderMapData();
    }, [renderMapData]);

    useImperativeHandle(
      ref,
      () => ({
        focusLocation(loc: MurimLocation) {
          const svgEl = svgRef.current;
          const container = containerRef.current;
          const projection = projectionRef.current;
          const zoomBehavior = zoomBehaviorRef.current;
          if (!svgEl || !container || !projection || !zoomBehavior) return;

          const w = container.clientWidth || 800;
          const h = container.clientHeight || 600;
          const projected = projection(loc.coords);
          if (!projected) return;
          const [x, y] = projected;
          const targetScale = 2.4;
          const transform = d3.zoomIdentity
            .translate(w / 2 - x * targetScale, h / 2 - y * targetScale)
            .scale(targetScale);
          d3.select(svgEl)
            .transition()
            .duration(550)
            .call(zoomBehavior.transform, transform);
        },
      }),
      [],
    );

    const handleZoomIn = () => {
      if (svgRef.current && zoomBehaviorRef.current) {
        d3.select(svgRef.current)
          .transition()
          .duration(250)
          .call(zoomBehaviorRef.current.scaleBy, 1.45);
      }
    };

    const handleZoomOut = () => {
      if (svgRef.current && zoomBehaviorRef.current) {
        d3.select(svgRef.current)
          .transition()
          .duration(250)
          .call(zoomBehaviorRef.current.scaleBy, 0.7);
      }
    };

    const handleZoomReset = () => {
      if (svgRef.current && zoomBehaviorRef.current) {
        d3.select(svgRef.current)
          .transition()
          .duration(450)
          .call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
      }
    };

    return (
      <section
        ref={containerRef}
        className={`map-container flex-1 min-h-[440px] lg:min-h-[calc(100vh-57px)] relative ${
          mapStyle === 'sumie' ? 'style-sumie' : ''
        } ${addPinMode ? 'pin-mode' : ''}`}
      >
        <svg
          ref={svgRef}
          className="w-full h-full block"
          role="img"
          aria-label="중국 중원 및 새외 무림 인터랙티브 벡터 지도"
        />

        {/* Non-blocking Status Pill */}
        {atlasStatus !== 'ready' && (
          <div className="absolute top-3 left-3 card-surface border rounded-full px-3.5 py-1.5 text-xs shadow-sm flex items-center gap-2 z-10">
            {atlasStatus === 'loading' && (
              <div
                className="w-3.5 h-3.5 border-2 border-t-transparent rounded-full animate-spin shrink-0"
                style={{
                  borderColor: 'var(--accent)',
                  borderTopColor: 'transparent',
                }}
              />
            )}
            <span className="font-medium" style={{ color: 'var(--text-sub)' }}>
              {atlasStatus === 'loading'
                ? '지형 벡터 로드 중...'
                : '경위도 좌표계 모드 (지형 데이터 미로드)'}
            </span>
            {atlasStatus === 'error' && (
              <button
                type="button"
                onClick={loadAtlas}
                className="underline font-semibold ml-1 cursor-pointer"
                style={{ color: 'var(--accent)' }}
              >
                다시 시도
              </button>
            )}
          </div>
        )}

        {/* Pin Mode Banner */}
        {addPinMode && (
          <div
            className="absolute top-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium text-white shadow-lg flex items-center gap-2 z-10"
            style={{ background: 'var(--accent)' }}
          >
            <Crosshair className="w-4 h-4" />
            <span>지도에서 새 문파를 배치할 위치를 클릭하세요</span>
            <button
              type="button"
              onClick={onCancelPinMode}
              className="ml-1 underline text-white/90 hover:text-white cursor-pointer"
            >
              취소
            </button>
          </div>
        )}

        {/* Floating Zoom Controls */}
        <div className="absolute bottom-4 left-4 flex flex-col gap-1.5 z-10">
          <button
            type="button"
            onClick={handleZoomIn}
            className="card-surface border w-9 h-9 rounded-lg shadow-sm flex items-center justify-center hover:opacity-85 cursor-pointer"
            aria-label="확대"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="card-surface border w-9 h-9 rounded-lg shadow-sm flex items-center justify-center hover:opacity-85 cursor-pointer"
            aria-label="축소"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomReset}
            className="card-surface border w-9 h-9 rounded-lg shadow-sm flex items-center justify-center hover:opacity-85 cursor-pointer"
            aria-label="중원 기본 시점"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>

        {/* Coordinate Readout & Legend */}
        <div className="absolute bottom-4 right-4 card-surface border rounded-lg px-3 py-1.5 text-xs shadow-sm hidden sm:flex items-center gap-3 z-10">
          <span className="font-mono-code" style={{ color: 'var(--text-mute)' }}>
            {coordText}
          </span>
          <span className="opacity-30">|</span>
          <span className="font-medium" style={{ color: 'var(--text-sub)' }}>
            표시 거점 {filteredLocations.length}곳
          </span>
        </div>
      </section>
    );
  },
);
