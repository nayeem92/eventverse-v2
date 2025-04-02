import { FC } from 'react';

interface Approval {
  id: number;
  name: string;
  submittedBy: string;
}

interface ApprovalListProps {
  approvals: Approval[];
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

const ApprovalList: FC<ApprovalListProps> = ({ approvals, onApprove, onReject }) => {
  return (
    <div className="card bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow mb-8">
      <div className="card-body p-6">
        <h5 className="card-title text-xl font-semibold mb-6 text-gray-800">Pending Approvals</h5>
        <div className="space-y-4">
          {approvals.map((approval) => (
            <div
              key={approval.id}
              className="p-5 border-l-4 border-blue-500 bg-blue-50 rounded-lg flex justify-between items-center hover:bg-blue-100 transition-colors"
            >
              <div>
                <h6 className="font-semibold text-gray-800 text-lg">{approval.name}</h6>
                <small className="text-gray-600 text-sm">Submitted by: {approval.submittedBy}</small>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => onApprove(approval.id)}
                  className="px-4 py-2 bg-transparent border border-green-500 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-colors text-sm"
                >
                  Approve
                </button>
                <button
                  onClick={() => onReject(approval.id)}
                  className="px-4 py-2 bg-transparent border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors text-sm"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApprovalList;