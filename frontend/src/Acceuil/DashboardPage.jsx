import React, { useEffect, useState } from "react";
import {
  Activity,
  BookOpen,
  Package,
  Users,
  Wheat,
} from "lucide-react";
import { useOpen } from "./OpenProvider";
import axiosInstance from "../axiosInstance";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const DashboardPage = () => {
  const [stats, setStats] = useState({
    total_produits: 0,
    total_matieres_premieres: 0,
    total_recettes: 0,
    total_utilisateurs: 0,
    activites_recentes: [],
    repartition_produits: [],
    cost_evolution: [],
    indicators: {
      cout_revient_moyen: null,
      marge_moyenne_pct: null,
      produits_non_rentables: null,
      simulations_active: null,
    },
  });
  const [loading, setLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");
  const { dynamicStyles } = useOpen();

  const formatMetricValue = (value, suffix = "") => {
    if (value === null || value === undefined || value === "") {
      return null;
    }

    return `${Number(value).toFixed(2)}${suffix}`;
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axiosInstance.get("/api/dashboard-stats");
        console.log("[DashboardPage] /api/dashboard-stats response:", response);
        const payload = response.data?.data;

        if (response.status === 200 && payload) {
          setStats({
            total_produits: Number(payload?.counts?.total_produits ?? 0),
            total_matieres_premieres: Number(payload?.counts?.total_matieres_premieres ?? 0),
            total_recettes: Number(payload?.counts?.total_recettes ?? 0),
            total_utilisateurs: Number(payload?.counts?.total_utilisateurs ?? 0),
            activites_recentes: Array.isArray(payload?.recent_activities)
              ? payload.recent_activities
              : [],
            repartition_produits: Array.isArray(payload?.product_distribution)
              ? payload.product_distribution
              : [],
            cost_evolution: Array.isArray(payload?.cost_evolution)
              ? payload.cost_evolution
              : [],
            indicators: {
              cout_revient_moyen: payload?.indicators?.cout_revient_moyen ?? null,
              marge_moyenne_pct: payload?.indicators?.marge_moyenne_pct ?? null,
              produits_non_rentables: payload?.indicators?.produits_non_rentables ?? null,
              simulations_active: payload?.indicators?.simulations_active ?? null,
            },
          });
        } else {
          throw new Error(`Unexpected dashboard response: ${response.status}`);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du dashboard :", error);
        setDashboardError(
          "Impossible de charger les statistiques du dashboard. Vérifiez la connexion au backend ou relancez le serveur."
        );
        setStats({
          total_produits: 0,
          total_matieres_premieres: 0,
          total_recettes: 0,
          total_utilisateurs: 0,
          activites_recentes: [],
          repartition_produits: [],
          cost_evolution: [],
          indicators: {
            cout_revient_moyen: null,
            marge_moyenne_pct: null,
            produits_non_rentables: null,
            simulations_active: null,
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActivityBadgeClass = (action = "") => {
    const normalized = action.toLowerCase();
    if (normalized.includes("création") || normalized.includes("creation")) {
      return "bg-emerald-500";
    }
    if (
      normalized.includes("modification") ||
      normalized.includes("mise à jour") ||
      normalized.includes("update")
    ) {
      return "bg-sky-500";
    }
    if (normalized.includes("connexion") || normalized.includes("login")) {
      return "bg-slate-400";
    }
    return "bg-slate-400";
  };

  const displayStats = {
    total_produits: Number(stats.total_produits ?? 0),
    total_matieres_premieres: Number(stats.total_matieres_premieres ?? 0),
    total_recettes: Number(stats.total_recettes ?? 0),
    total_utilisateurs: Number(stats.total_utilisateurs ?? 0),
    activites_recentes: Array.isArray(stats.activites_recentes) ? stats.activites_recentes : [],
    repartition_produits: Array.isArray(stats.repartition_produits) ? stats.repartition_produits : [],
    cost_evolution: Array.isArray(stats.cost_evolution) ? stats.cost_evolution : [],
    indicators: stats.indicators ?? {
      cout_revient_moyen: null,
      marge_moyenne_pct: null,
      produits_non_rentables: null,
      simulations_active: null,
    },
  };

  const systemCards = [
    {
      title: "Produits",
      value: displayStats.total_produits,
      Icon: Package,
    },
    {
      title: "Matières premières",
      value: displayStats.total_matieres_premieres,
      Icon: Wheat,
    },
    {
      title: "Recettes",
      value: displayStats.total_recettes,
      Icon: BookOpen,
    },
    {
      title: "Utilisateurs",
      value: displayStats.total_utilisateurs,
      Icon: Users,
    },
  ];

  const costCards = [
    {
      title: "Coût de revient moyen",
      value:
        displayStats.indicators.cout_revient_moyen !== null
          ? formatMetricValue(displayStats.indicators.cout_revient_moyen)
          : null,
      footer:
        displayStats.indicators.cout_revient_moyen !== null
          ? "Données backend disponibles"
          : "Données pas encore disponibles",
    },
    {
      title: "Marge moyenne",
      value:
        displayStats.indicators.marge_moyenne_pct !== null
          ? formatMetricValue(displayStats.indicators.marge_moyenne_pct, " %")
          : null,
      footer:
        displayStats.indicators.marge_moyenne_pct !== null
          ? "Données backend disponibles"
          : "Données pas encore disponibles",
    },
    {
      title: "Produits non rentables",
      value:
        displayStats.indicators.produits_non_rentables !== null
          ? Number(displayStats.indicators.produits_non_rentables)
          : null,
      footer:
        displayStats.indicators.produits_non_rentables !== null
          ? "Données backend disponibles"
          : "Données pas encore disponibles",
      highlight: true,
    },
    {
      title: "Simulations actives",
      value:
        displayStats.indicators.simulations_active !== null
          ? Number(displayStats.indicators.simulations_active)
          : null,
      footer:
        displayStats.indicators.simulations_active !== null
          ? "Données backend disponibles"
          : "Données pas encore disponibles",
    },
  ];

  const repartitionData = Array.isArray(displayStats.repartition_produits)
    ? displayStats.repartition_produits
    : [];

  const chartData = repartitionData
    .map((item, index) => ({
      name: item.categorie || `Catégorie ${index + 1}`,
      value: Number(item.produits_count ?? 0),
    }))
    .filter((item) => item.value > 0);

  const pieColors = ["#2563eb", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4", "#f97316"];

  const donutTotal = chartData.reduce((sum, item) => sum + item.value, 0);

  const donutLegend = chartData.map((item, index) => ({
    ...item,
    color: pieColors[index % pieColors.length],
    percent: donutTotal > 0 ? Math.round((item.value / donutTotal) * 100) : 0,
  }));

  const costEvolutionData = displayStats.cost_evolution;
  const hasCostEvolution = costEvolutionData.length > 0;
  const hasDonutData = chartData.length > 0;

  return (
    <main
      style={dynamicStyles}
      className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="rounded-[28px] border border-slate-200/80 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-6 text-white shadow-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-300">
                Vue d’ensemble
              </p>
              <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
                Tableau de bord intelligent
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
                Les données réelles sont affichées lorsque elles existent. Si elles
                sont absentes, une valeur de secours est utilisée uniquement côté
                interface pour garder le dashboard complet et cohérent.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-100">
                <Activity className="h-4 w-4" />
                {loading ? "Chargement..." : "En ligne"}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
                  Données du système
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  Vue d’ensemble des compteurs
                </h2>
              </div>
            </div>
          </div>

          {dashboardError ? (
            <div className="mx-6 mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:mx-8">
              {dashboardError}
            </div>
          ) : null}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 divide-y divide-slate-200 xl:divide-y-0 xl:divide-x">
            {systemCards.map((card, index) => (
              <div
                key={card.title}
                className={`px-6 py-6 sm:px-8 ${index > 0 ? "border-t border-slate-200 xl:border-t-0" : ""}`}
              >
                <div className="flex items-center justify-center text-slate-400">
                  <card.Icon className="h-6 w-6" />
                </div>
                <div className="mt-4 text-center">
                  <p className="text-3xl font-semibold text-slate-900">
                    {loading ? "..." : card.value}
                  </p>
                  <p className="mt-2 text-sm uppercase tracking-[0.18em] text-slate-500">
                    {card.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          {costCards.map((card) => (
            <div
              key={card.title}
              className={`rounded-[24px] border p-5 shadow-sm transition hover:shadow-md ${card.highlight ? "border-rose-200 bg-rose-50" : "border-slate-200 bg-white"}`}
            >
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                {card.title}
              </p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">
                {card.value !== null ? card.value : "—"}
              </p>
              <p className={`mt-3 text-sm ${card.highlight ? "text-rose-700" : "text-slate-500"}`}>
                {card.footer}
              </p>
            </div>
          ))}
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.45fr_1fr]">
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Évolution du coût de revient (6 mois)
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Données temporelles selon la disponibilité du backend.
                </p>
              </div>
            </div>

            <div className="mt-6 h-72 w-full rounded-[20px] border border-slate-200 bg-slate-50 p-4">
              {hasCostEvolution ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={costEvolutionData}
                    margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.18} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#2563eb" fill="url(#colorCost)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center rounded-[20px] border border-dashed border-slate-300 bg-white/90 px-4 text-center text-sm text-slate-500">
                  Historique pas encore disponible
                </div>
              )}
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-slate-900">
                Répartition des produits par catégorie
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Données issues de la répartition par catégorie.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-[0.9fr_0.55fr]">
              <div className="h-72 w-full rounded-[20px] border border-slate-200 bg-slate-50 p-4">
                {hasDonutData ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={52}
                        outerRadius={86}
                        paddingAngle={3}
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`${entry.name}-${index}`}
                            fill={pieColors[index % pieColors.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center rounded-[16px] bg-white/90 text-sm text-slate-500">
                    Aucune répartition disponible
                  </div>
                )}
              </div>

              <div className="space-y-3 rounded-[20px] border border-slate-200 bg-slate-50 p-4">
                {donutLegend.length > 0 ? (
                  donutLegend.map((item) => (
                    <div key={item.name} className="flex items-center justify-between gap-3 rounded-2xl bg-white px-3 py-2 shadow-sm">
                      <div className="flex items-center gap-3">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-slate-700">{item.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{item.percent}%</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">Aucune catégorie avec des produits actifs.</p>
                )}
              </div>
            </div>
          </section>
        </div>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-900">
              Activités récentes
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Dernières actions enregistrées dans le système.
            </p>
          </div>

          <div className="divide-y divide-slate-200">
            {displayStats.activites_recentes.length > 0 ? (
              displayStats.activites_recentes.map((activity, index) => (
                <div
                  key={`${activity.user || "système"}-${index}`}
                  className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-1 h-2.5 w-2.5 rounded-full ${getActivityBadgeClass(
                        activity.action
                      )}`}
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {activity.action || "Activité"}
                      </p>
                      <p className="text-sm text-slate-500">
                        {activity.subject || "Sujet non précisé"} •{" "}
                        {activity.user || "Système"}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-slate-500">
                    {formatDate(activity.created_at)}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
                {loading ? "Chargement..." : "Aucune activité disponible pour le moment."}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default DashboardPage;
