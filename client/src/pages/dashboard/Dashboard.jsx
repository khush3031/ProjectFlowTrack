import { Link } from 'react-router-dom'
import { useAuth }     from '../../hooks/useAuth'
import { useOrg }      from '../../hooks/useOrg'
import { useProjects } from '../../hooks/useProjects'
import { getMyActivityApi } from '../../api/activityApi'
import ActivityFeed    from '../../components/activity/ActivityFeed'

export default function Dashboard() {
  const { user, isAdmin } = useAuth()
  const { org, members }  = useOrg()
  const { projects }      = useProjects()

  const activityFetchFn = (params) => getMyActivityApi(params)

  return (
    <div className="w-full flex flex-col gap-9">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-[#1a202c]">
          Good {getTimeOfDay()}, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-[14px] text-[#4a5568]">
          Here is what is happening in <span className="font-semibold text-primary">{org?.name ?? 'your workspace'}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#e2e8f0] rounded-lg p-6 shadow-sm">
          <p className="text-[12px] font-bold uppercase tracking-wider text-[#a0aec0] mb-2">Projects</p>
          <p className="text-3xl font-bold text-[#1a202c] mb-1">{projects.length}</p>
          <p className="text-[12px] text-[#4a5568]">active projects</p>
        </div>
        <div className="bg-white border border-[#e2e8f0] rounded-lg p-6 shadow-sm">
          <p className="text-[12px] font-bold uppercase tracking-wider text-[#a0aec0] mb-2">Team size</p>
          <p className="text-3xl font-bold text-[#1a202c] mb-1">{members.length}</p>
          <p className="text-[12px] text-[#4a5568]">members</p>
        </div>
        <div className="bg-white border border-[#e2e8f0] rounded-lg p-6 shadow-sm">
          <p className="text-[12px] font-bold uppercase tracking-wider text-[#a0aec0] mb-2">Your role</p>
          <p className="text-[18px] font-bold text-primary mb-1 uppercase tracking-tight">
            {user?.role}
          </p>
          <p className="text-[12px] text-[#4a5568]">
            {isAdmin ? 'Full administrative access' : 'Standard member access'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-9 items-start">
        <div className="bg-white border border-[#e2e8f0] rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[16px] font-bold text-[#1a202c]">Your projects</h2>
            {isAdmin && (
              <Link to="/projects" className="text-[12px] font-semibold text-primary hover:underline">
                Manage all →
              </Link>
            )}
          </div>
          {projects.length === 0 ? (
            <div className="py-12 flex flex-col items-center border-2 border-dashed border-[#edf2f7] rounded-lg">
              <p className="text-[14px] text-[#a0aec0] mb-4">No projects yet</p>
              {isAdmin && (
                <Link to="/projects" className="btn-primary py-1.5 px-4 text-[13px]">
                  Create first project
                </Link>
              )}
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-[#edf2f7]">
              {projects.slice(0, 5).map(p => (
                <Link
                  key={p._id}
                  to={`/projects/${p._id}/issues`}
                  className="py-3.5 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-[14px] font-semibold text-[#4a5568] group-hover:text-primary transition-colors">{p.name}</span>
                  </div>
                  <span className="text-[12px] text-[#a0aec0]">
                    {p.members?.length ?? 0} members
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-lg p-6 shadow-sm min-h-[400px]">
          <ActivityFeed
            fetchFn={activityFetchFn}
            showIssueTitle={true}
            title="Recent activity"
            compact={true}
          />
        </div>
      </div>
    </div>
  )
}

const getTimeOfDay = () => {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
