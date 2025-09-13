import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

import Button from '@/components/Button/index';
import Card from '@/components/Card/index';
import Content from '@/components/Content/index';
import Meta from '@/components/Meta/index';
import DomainHealthDashboard from '@/components/Dashboard/DomainHealthDashboard';
import ComingSoon from '@/components/Dashboard/ComingSoon';
import { useInvitations, useWorkspaces } from '@/hooks/data/index';
import { AccountLayout } from '@/layouts/index';
import api from '@/lib/common/api';
import { useWorkspace } from '@/providers/workspace';
import { useTranslation } from "react-i18next";

const Welcome = () => {
  const router = useRouter();
  const { data: invitationsData, isLoading: isFetchingInvitations } =
    useInvitations();
  const { data: workspacesData, isLoading: isFetchingWorkspaces } =
    useWorkspaces();
  const { setWorkspace, workspace } = useWorkspace();
  const { t } = useTranslation();
  const [isSubmitting, setSubmittingState] = useState(false);
  const [domains, setDomains] = useState([]);
  const [isLoadingDomains, setIsLoadingDomains] = useState(true);

  // Mock domains data - in production, this would come from API
  useEffect(() => {
    const mockDomains = [
      {
        id: '1',
        name: 'example.com',
        healthScore: 85,
        isHealthy: true,
        spamHouseStatus: 'CLEAN',
        spfRecord: true,
        dkimRecord: true,
        dmarcRecord: false,
        mxRecords: true,
        lastChecked: new Date().toISOString()
      },
      {
        id: '2',
        name: 'testdomain.org',
        healthScore: 45,
        isHealthy: false,
        spamHouseStatus: 'FLAGGED',
        spfRecord: false,
        dkimRecord: false,
        dmarcRecord: false,
        mxRecords: true,
        lastChecked: new Date(Date.now() - 86400000).toISOString()
      }
    ];

    setTimeout(() => {
      setDomains(mockDomains);
      setIsLoadingDomains(false);
    }, 1000);
  }, []);

  const accept = (memberId) => {
    setSubmittingState(true);
    api(`/api/workspace/team/accept`, {
      body: { memberId },
      method: 'PUT',
    }).then((response) => {
      setSubmittingState(false);

      if (response.errors) {
        Object.keys(response.errors).forEach((error) =>
          toast.error(response.errors[error].msg)
        );
      } else {
        toast.success('Accepted invitation!');
      }
    });
  };

  const decline = (memberId) => {
    setSubmittingState(true);
    api(`/api/workspace/team/decline`, {
      body: { memberId },
      method: 'PUT',
    }).then((response) => {
      setSubmittingState(false);

      if (response.errors) {
        Object.keys(response.errors).forEach((error) =>
          toast.error(response.errors[error].msg)
        );
      } else {
        toast.success('Declined invitation!');
      }
    });
  };

  const navigate = (workspace) => {
    setWorkspace(workspace);
    router.replace(`/account/${workspace.slug}`);
  };

  return (
    <AccountLayout>
      <Meta title="Vitmail-C - Domain Health Dashboard" />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 bg-vitamin-100 rounded-xl">
            <span className="text-3xl">🍊</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Domain Health Dashboard</h1>
            <p className="text-gray-600">Monitor your domains&apos; immunity system in real-time</p>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="space-y-8">
        {/* Domain Health Analytics */}
        <DomainHealthDashboard domains={domains} />

        {/* Coming Soon Section */}
        <ComingSoon />

        {/* Workspace Selection (if no workspace selected) */}
        {!workspace && (
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <Card.Body className="p-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">🏢 Select a Workspace</h3>
                <p className="text-gray-600 mb-4">Choose a workspace to manage your domains</p>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {isFetchingWorkspaces ? (
                    <div className="col-span-full">
                      <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                      </div>
                    </div>
                  ) : workspacesData?.workspaces.length > 0 ? (
                    workspacesData.workspaces.map((workspace, index) => (
                      <div key={index} className="p-4 bg-white rounded-lg border border-gray-200 hover:border-vitamin-300 transition-colors">
                        <h4 className="font-semibold text-gray-900 mb-2">{workspace.name}</h4>
                        <p className="text-sm text-gray-600 mb-3">Click to manage domains</p>
                        <button
                          className="w-full px-4 py-2 bg-vitamin-600 text-white rounded-lg hover:bg-vitamin-700 transition-colors"
                          onClick={() => navigate(workspace)}
                        >
                          Select Workspace →
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <div className="text-6xl mb-4">🏢</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No workspaces yet</h3>
                      <p className="text-gray-600 mb-4">Create your first workspace to start monitoring domains</p>
                      <button className="px-6 py-3 bg-vitamin-600 text-white rounded-lg hover:bg-vitamin-700 transition-colors">
                        Create Workspace
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Invitations Section */}
        {invitationsData?.invitations.length > 0 && (
          <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
            <Card.Body className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">📧 Workspace Invitations</h3>
              <div className="space-y-4">
                {invitationsData.invitations.map((invitation, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-yellow-200">
                    <div>
                      <h4 className="font-semibold text-gray-900">{invitation.workspace.name}</h4>
                      <p className="text-sm text-gray-600">
                        Invited by {invitation.invitedBy.name || invitation.invitedBy.email}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        className="px-4 py-2 bg-green-600 text-white hover:bg-green-700"
                        disabled={isSubmitting}
                        onClick={() => accept(invitation.id)}
                      >
                        Accept
                      </Button>
                      <Button
                        className="px-4 py-2 text-red-600 border border-red-600 hover:bg-red-600 hover:text-white"
                        disabled={isSubmitting}
                        onClick={() => decline(invitation.id)}
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        )}
      </div>
    </AccountLayout>
  );
};

export default Welcome;
