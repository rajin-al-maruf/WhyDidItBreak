import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProject, getProjectIssues } from '../api/projectApi';
import ProjectHeader from '../components/project/ProjectHeader';
import IssueListItem from '../components/issues/IssueListItem';
import IssuesEmptyState from '../components/issues/IssuesEmptyState';
import { ArrowLeftIcon, AlertCircleIcon, SearchIcon } from '../components/common/Icons';

const ProjectIssuesPage = () => {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      setLoading(true);
      setError('');

      try {
        const [projectData, issuesData] = await Promise.all([
          getProject(id),
          getProjectIssues(id),
        ]);

        if (active) {
          setProject(projectData.project);
          setIssues(issuesData.issues || []);
        }
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || 'Unable to load project issues.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, [id]);

  const filteredIssues = issues.filter((issue) =>
    issue.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5" />
          <span>Back to Projects</span>
        </Link>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-300"
        >
          <AlertCircleIcon className="h-4 w-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="space-y-6 animate-pulse">
          <div className="h-10 w-1/3 bg-zinc-800 rounded-xl" />
          <div className="h-12 w-full bg-zinc-900/60 rounded-xl border border-white/[0.06]" />
          <div className="h-48 w-full bg-zinc-900/40 rounded-2xl border border-white/[0.06]" />
        </div>
      )}

      {!loading && !error && project && (
        <div className="space-y-6">
{/* Reusable Header with Tabs */}
          <ProjectHeader
            project={project}
            activeTab="issues"
            issueCount={issues.length}
          />

{/* Search Bar */}
          {issues.length > 0 && (
            <div className="relative max-w-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500">
                <SearchIcon className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search issues by title..."
                className="block w-full rounded-xl border border-zinc-800 bg-zinc-900/50 pl-10 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition"
              />
            </div>
          )}

{/* List or Empty State */}
          {issues.length === 0 ? (
            <IssuesEmptyState projectId={id} />
          ) : (
            <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 overflow-hidden shadow-xl divide-y divide-white/[0.06]">
              {filteredIssues.map((issue) => (
                <IssueListItem key={issue._id} issue={issue} projectId={id} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectIssuesPage;